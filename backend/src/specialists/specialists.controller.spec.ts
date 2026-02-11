import { Test, TestingModule } from '@nestjs/testing';
import { SpecialistsController } from './specialists.controller';
import { SpecialistsService } from './specialists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotFoundException } from '@nestjs/common';
import { Specialist, SpecialistCategory } from '../database/entities/specialist.entity';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

describe('SpecialistsController', () => {
  let controller: SpecialistsController;
  let service: jest.Mocked<SpecialistsService>;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    slug: 'jan-novak',
    name: 'Jan Novak',
    email: 'jan@example.com',
    phone: '+420123456789',
    rating: 4.5,
    reviewsCount: 10,
  } as Specialist;

  const mockRequest = {
    user: {
      userId: 'user-123',
      email: 'jan@example.com',
      role: 'specialist',
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialistsController],
      providers: [
        {
          provide: SpecialistsService,
          useValue: {
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            findByUserId: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SpecialistsController>(SpecialistsController);
    service = module.get(SpecialistsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated specialists', async () => {
      const result = {
        specialists: [mockSpecialist],
        total: 1,
        page: 1,
        limit: 12,
        totalPages: 1,
      };
      service.findAll.mockResolvedValue(result);

      const response = await controller.findAll({});

      expect(response).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should pass filters to service', async () => {
      const filters = { category: SpecialistCategory.FINANCIAL_ADVISOR, page: 2, limit: 6 };
      service.findAll.mockResolvedValue({
        specialists: [],
        total: 0,
        page: 2,
        limit: 6,
        totalPages: 0,
      });

      await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findBySlug', () => {
    it('should return specialist by slug', async () => {
      const specialistWithReviews = { ...mockSpecialist, reviews: [] };
      service.findBySlug.mockResolvedValue(specialistWithReviews);

      const result = await controller.findBySlug('jan-novak');

      expect(result).toEqual(specialistWithReviews);
      expect(service.findBySlug).toHaveBeenCalledWith('jan-novak');
    });

    it('should throw NotFoundException if specialist not found', async () => {
      service.findBySlug.mockRejectedValue(
        new NotFoundException('Specialist not found'),
      );

      await expect(controller.findBySlug('invalid-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getMyProfile', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getMyProfile);
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });

    it('should return specialist profile for authenticated user', async () => {
      service.findByUserId.mockResolvedValue(mockSpecialist);

      const result = await controller.getMyProfile(mockRequest);

      expect(result).toEqual(mockSpecialist);
      expect(service.findByUserId).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException if profile not found', async () => {
      service.findByUserId.mockRejectedValue(
        new NotFoundException('Specialist profile not found'),
      );

      await expect(controller.getMyProfile(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateProfile', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.updateProfile,
      );
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });

    it('should update specialist profile', async () => {
      const updateDto = { bio: 'Updated bio' };
      const updatedSpecialist = { ...mockSpecialist, bio: 'Updated bio' } as Specialist;
      service.update.mockResolvedValue(updatedSpecialist);

      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(result).toEqual(updatedSpecialist);
      expect(service.update).toHaveBeenCalledWith('user-123', updateDto);
    });
  });

  describe('Guard Integration', () => {
    it('should apply JwtAuthGuard to authenticated endpoints', () => {
      const authMethods = ['getMyProfile', 'updateProfile'];

      authMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          (controller as unknown as Record<string, Function>)[method],
        );
        expect(guards).toBeDefined();
        const guardNames = guards.map(
          (guard: { name: string }) => guard.name,
        );
        expect(guardNames).toContain('JwtAuthGuard');
      });
    });

    it('should not apply JwtAuthGuard to public endpoints', () => {
      const publicMethods = ['findAll', 'findBySlug'];

      publicMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          (controller as unknown as Record<string, Function>)[method],
        );
        // Public endpoints should have no guards or undefined
        if (guards) {
          const guardNames = guards.map(
            (guard: { name: string }) => guard.name,
          );
          expect(guardNames).not.toContain('JwtAuthGuard');
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should propagate service errors', async () => {
      service.findBySlug.mockRejectedValue(new Error('Database error'));

      await expect(controller.findBySlug('some-slug')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
