import { Test, TestingModule } from '@nestjs/testing';
import { CommissionsController } from './commissions.controller';
import { CommissionsService } from '../services/commissions.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import {
  Commission,
  CommissionStatus,
} from '../../database/entities/commission.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Specialist } from '../../database/entities/specialist.entity';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

describe('CommissionsController', () => {
  let controller: CommissionsController;
  let service: jest.Mocked<CommissionsService>;
  let specialistRepository: any;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    name: 'John Specialist',
    email: 'john@example.com',
  };

  const mockCommission = {
    id: 'commission-123',
    dealId: 'deal-123',
    specialistId: 'specialist-123',
    dealValue: 100000,
    commissionRate: 0.15,
    commissionAmount: 15000,
    status: CommissionStatus.PENDING,
  } as Commission;

  const mockRequest = {
    user: {
      userId: 'user-123',
      email: 'john@example.com',
      role: 'specialist',
    },
  } as unknown as AuthenticatedRequest;

  const mockAdminRequest = {
    user: {
      userId: 'admin-123',
      email: 'admin@example.com',
      role: 'admin',
    },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const mockSpecialistRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommissionsController],
      providers: [
        {
          provide: CommissionsService,
          useValue: {
            getMyCommissions: jest.fn(),
            getCommissionStats: jest.fn(),
            payCommission: jest.fn(),
            getAllPending: jest.fn(),
            waiveCommission: jest.fn(),
            specialistRepository: mockSpecialistRepository,
          },
        },
        {
          provide: getRepositoryToken(Specialist),
          useValue: mockSpecialistRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CommissionsController>(CommissionsController);
    service = module.get(CommissionsService);
    specialistRepository = service['specialistRepository'];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMyCommissions', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getMyCommissions,
      );
      expect(guards).toBeDefined();
      expect(guards.length).toBeGreaterThan(0);
    });

    it('should return user commissions', async () => {
      const commissions = [mockCommission];
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      service.getMyCommissions.mockResolvedValue(commissions);

      const result = await controller.getMyCommissions(mockRequest);

      expect(result).toEqual(commissions);
      expect(specialistRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
      expect(service.getMyCommissions).toHaveBeenCalledWith('specialist-123');
    });
  });

  describe('getMyStats', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.getMyStats);
      expect(guards).toBeDefined();
    });

    it('should return commission statistics', async () => {
      const stats = {
        pending: [],
        paid: [],
        totalPending: 15000,
        totalPaid: 30000,
        totalCommissions: 5,
        averageCommission: 9000,
      };

      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      service.getCommissionStats.mockResolvedValue(stats);

      const result = await controller.getMyStats(mockRequest);

      expect(result).toEqual(stats);
      expect(service.getCommissionStats).toHaveBeenCalledWith('specialist-123');
    });
  });

  describe('payCommission', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.payCommission,
      );
      expect(guards).toBeDefined();
    });

    it('should create payment intent', async () => {
      const clientSecret = { clientSecret: 'secret_123' };
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      service.payCommission.mockResolvedValue(clientSecret);

      const result = await controller.payCommission(
        'commission-123',
        mockRequest,
      );

      expect(result).toEqual(clientSecret);
      expect(service.payCommission).toHaveBeenCalledWith(
        'commission-123',
        'specialist-123',
      );
    });

    it('should return clientSecret', async () => {
      const clientSecret = { clientSecret: 'secret_abc123' };
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      service.payCommission.mockResolvedValue(clientSecret);

      const result = await controller.payCommission(
        'commission-123',
        mockRequest,
      );

      expect(result.clientSecret).toBe('secret_abc123');
    });

    it('should throw 404 if commission not found', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      service.payCommission.mockRejectedValue(
        new NotFoundException('Commission not found'),
      );

      await expect(
        controller.payCommission('invalid-id', mockRequest),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllPending', () => {
    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getAllPending,
      );
      expect(guards).toBeDefined();
    });

    it('should require AdminGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.getAllPending,
      );
      const guardNames = guards.map((guard: any) => guard.name);
      expect(guardNames).toContain('AdminGuard');
    });

    it('should return pending commissions for admin', async () => {
      const pendingCommissions = [mockCommission];
      service.getAllPending.mockResolvedValue(pendingCommissions);

      const result = await controller.getAllPending(mockAdminRequest);

      expect(result).toEqual(pendingCommissions);
      expect(service.getAllPending).toHaveBeenCalled();
    });
  });

  describe('waiveCommission', () => {
    const waiveDto = { note: 'Special case approved' };

    it('should require JWT authentication', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.waiveCommission,
      );
      expect(guards).toBeDefined();
    });

    it('should require AdminGuard', () => {
      const guards = Reflect.getMetadata(
        '__guards__',
        controller.waiveCommission,
      );
      const guardNames = guards.map((guard: any) => guard.name);
      expect(guardNames).toContain('AdminGuard');
    });

    it('should waive commission fee for admin', async () => {
      const waivedCommission = {
        ...mockCommission,
        status: CommissionStatus.WAIVED,
        notes: waiveDto.note,
      };
      service.waiveCommission.mockResolvedValue(waivedCommission);

      const result = await controller.waiveCommission(
        'commission-123',
        mockAdminRequest,
        waiveDto,
      );

      expect(result).toEqual(waivedCommission);
      expect(service.waiveCommission).toHaveBeenCalledWith(
        'commission-123',
        waiveDto.note,
      );
    });

    it('should pass note to service', async () => {
      service.waiveCommission.mockResolvedValue({
        ...mockCommission,
        status: CommissionStatus.WAIVED,
      });

      await controller.waiveCommission(
        'commission-123',
        mockAdminRequest,
        waiveDto,
      );

      expect(service.waiveCommission).toHaveBeenCalledWith(
        'commission-123',
        'Special case approved',
      );
    });
  });

  describe('Guard Integration', () => {
    it('should apply JwtAuthGuard to all endpoints', () => {
      const methods = [
        'getMyCommissions',
        'getMyStats',
        'payCommission',
        'getAllPending',
        'waiveCommission',
      ];

      methods.forEach((method) => {
        const guards = Reflect.getMetadata('__guards__', controller[method]);
        expect(guards).toBeDefined();
        const guardNames = guards.map((guard: any) => guard.name);
        expect(guardNames).toContain('JwtAuthGuard');
      });
    });

    it('should apply AdminGuard only to admin endpoints', () => {
      const adminMethods = ['getAllPending', 'waiveCommission'];
      const nonAdminMethods = [
        'getMyCommissions',
        'getMyStats',
        'payCommission',
      ];

      adminMethods.forEach((method) => {
        const guards = Reflect.getMetadata('__guards__', controller[method]);
        const guardNames = guards.map((guard: any) => guard.name);
        expect(guardNames).toContain('AdminGuard');
      });

      nonAdminMethods.forEach((method) => {
        const guards = Reflect.getMetadata('__guards__', controller[method]);
        const guardNames = guards.map((guard: any) => guard.name);
        expect(guardNames).not.toContain('AdminGuard');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle specialist not found error', async () => {
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(controller.getMyCommissions(mockRequest)).rejects.toThrow();
    });

    it('should propagate service errors', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      service.payCommission.mockRejectedValue(new Error('Payment failed'));

      await expect(
        controller.payCommission('commission-123', mockRequest),
      ).rejects.toThrow('Payment failed');
    });
  });
});
