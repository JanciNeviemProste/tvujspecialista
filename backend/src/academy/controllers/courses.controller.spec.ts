import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from '../services/courses.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  Course,
  CourseLevel,
  CourseCategory,
} from '../../database/entities/course.entity';

describe('CoursesController', () => {
  let controller: CoursesController;
  let service: jest.Mocked<CoursesService>;

  const mockCourse = {
    id: 'course-123',
    slug: 'financial-basics',
    title: 'Financial Basics',
    description: 'Learn the fundamentals of finance',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    level: CourseLevel.BEGINNER,
    category: CourseCategory.FINANCIAL,
    instructorName: 'Jan Novak',
    instructorBio: 'Senior financial advisor',
    instructorPhoto: 'https://example.com/photo.jpg',
    duration: 120,
    moduleCount: 5,
    lessonCount: 20,
    enrollmentCount: 100,
    rating: 4.5,
    reviewCount: 15,
    published: true,
    featured: false,
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Course;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: {
            findAll: jest.fn(),
            findBySlug: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            publish: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CoursesController>(CoursesController);
    service = module.get(CoursesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated courses', async () => {
      const result = {
        courses: [mockCourse],
        total: 1,
        page: 1,
        limit: 12,
      };
      service.findAll.mockResolvedValue(result);

      const response = await controller.findAll({});

      expect(response).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findBySlug', () => {
    it('should return course by slug', async () => {
      service.findBySlug.mockResolvedValue(mockCourse);

      const result = await controller.findBySlug('financial-basics');

      expect(result).toEqual(mockCourse);
      expect(service.findBySlug).toHaveBeenCalledWith('financial-basics');
    });

    it('should throw NotFoundException if course not found', async () => {
      service.findBySlug.mockRejectedValue(
        new NotFoundException('Course not found or not available'),
      );

      await expect(controller.findBySlug('invalid-slug')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should require JWT and Admin authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.create);
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
      expect(guardNames).toContain('AdminGuard');
    });

    it('should create a new course', async () => {
      const createDto = {
        title: 'Financial Basics',
        description: 'Learn the fundamentals of finance',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        level: CourseLevel.BEGINNER,
        category: CourseCategory.FINANCIAL,
        instructorName: 'Jan Novak',
        instructorBio: 'Senior financial advisor',
        instructorPhoto: 'https://example.com/photo.jpg',
        duration: 120,
      };
      service.create.mockResolvedValue(mockCourse);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCourse);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should require JWT and Admin authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.update);
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
      expect(guardNames).toContain('AdminGuard');
    });

    it('should update course', async () => {
      const updateDto = { title: 'Updated Title' };
      const updatedCourse = { ...mockCourse, title: 'Updated Title' } as Course;
      service.update.mockResolvedValue(updatedCourse);

      const result = await controller.update('course-123', updateDto);

      expect(result).toEqual(updatedCourse);
      expect(service.update).toHaveBeenCalledWith('course-123', updateDto);
    });

    it('should throw NotFoundException if course not found', async () => {
      service.update.mockRejectedValue(
        new NotFoundException('Course not found'),
      );

      await expect(
        controller.update('invalid-id', { title: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should require JWT and Admin authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.delete);
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
      expect(guardNames).toContain('AdminGuard');
    });

    it('should delete course and return success message', async () => {
      service.delete.mockResolvedValue(undefined);

      const result = await controller.delete('course-123');

      expect(result).toEqual({ message: 'Course deleted successfully' });
      expect(service.delete).toHaveBeenCalledWith('course-123');
    });

    it('should throw NotFoundException if course not found', async () => {
      service.delete.mockRejectedValue(
        new NotFoundException('Course not found'),
      );

      await expect(controller.delete('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if course has enrollments', async () => {
      service.delete.mockRejectedValue(
        new BadRequestException('Cannot delete course with active enrollments'),
      );

      await expect(controller.delete('course-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('publish', () => {
    it('should require JWT and Admin authentication', () => {
      const guards = Reflect.getMetadata('__guards__', controller.publish);
      expect(guards).toBeDefined();
      const guardNames = guards.map((guard: { name: string }) => guard.name);
      expect(guardNames).toContain('JwtAuthGuard');
      expect(guardNames).toContain('AdminGuard');
    });

    it('should publish course', async () => {
      const publishedCourse = { ...mockCourse, published: true } as Course;
      service.publish.mockResolvedValue(publishedCourse);

      const result = await controller.publish('course-123', true);

      expect(result).toEqual(publishedCourse);
      expect(service.publish).toHaveBeenCalledWith('course-123', true);
    });

    it('should unpublish course', async () => {
      const unpublishedCourse = { ...mockCourse, published: false } as Course;
      service.publish.mockResolvedValue(unpublishedCourse);

      const result = await controller.publish('course-123', false);

      expect(result).toEqual(unpublishedCourse);
      expect(service.publish).toHaveBeenCalledWith('course-123', false);
    });

    it('should throw BadRequestException if course not ready', async () => {
      service.publish.mockRejectedValue(
        new BadRequestException(
          'Course must have at least one module before publishing',
        ),
      );

      await expect(controller.publish('course-123', true)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('Guard Integration', () => {
    it('should apply AdminGuard only to admin endpoints', () => {
      const adminMethods = ['create', 'update', 'delete', 'publish'];

      adminMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          (controller as unknown as Record<string, Function>)[method],
        );
        expect(guards).toBeDefined();
        const guardNames = guards.map(
          (guard: { name: string }) => guard.name,
        );
        expect(guardNames).toContain('AdminGuard');
      });
    });

    it('should not apply guards to public endpoints', () => {
      const publicMethods = ['findAll', 'findBySlug'];

      publicMethods.forEach((method) => {
        const guards = Reflect.getMetadata(
          '__guards__',
          (controller as unknown as Record<string, Function>)[method],
        );
        if (guards) {
          const guardNames = guards.map(
            (guard: { name: string }) => guard.name,
          );
          expect(guardNames).not.toContain('AdminGuard');
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
