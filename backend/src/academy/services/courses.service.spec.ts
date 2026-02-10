import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  Course,
  CourseLevel,
  CourseCategory,
} from '../../database/entities/course.entity';
import { Module as CourseModule } from '../../database/entities/module.entity';

describe('CoursesService', () => {
  let service: CoursesService;
  let courseRepository: jest.Mocked<Repository<Course>>;
  let moduleRepository: jest.Mocked<Repository<CourseModule>>;

  const mockCourse = {
    id: 'course-123',
    slug: 'financial-planning-basics',
    title: 'Financial Planning Basics',
    description: 'Learn the basics of financial planning',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    level: CourseLevel.BEGINNER,
    category: CourseCategory.FINANCIAL,
    instructorName: 'Jane Smith',
    instructorBio: 'Expert instructor',
    instructorPhoto: 'https://example.com/photo.jpg',
    duration: 120,
    moduleCount: 3,
    lessonCount: 10,
    enrollmentCount: 50,
    rating: 4.5,
    reviewCount: 20,
    published: true,
    featured: false,
    position: 1,
    modules: [],
    enrollments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Course;

  const mockCourseWithModules = {
    ...mockCourse,
    modules: [
      {
        id: 'module-1',
        title: 'Introduction',
        lessons: [
          { id: 'lesson-1', title: 'Welcome', published: true },
          { id: 'lesson-2', title: 'Draft lesson', published: false },
        ],
      },
    ],
  } as unknown as Course;

  // Mock query builder
  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockCourse], 1]),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(CourseModule),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get(getRepositoryToken(Course));
    moduleRepository = module.get(getRepositoryToken(CourseModule));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated courses with default filters', async () => {
      const result = await service.findAll({});

      expect(courseRepository.createQueryBuilder).toHaveBeenCalledWith(
        'course',
      );
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'course.published = :published',
        { published: true },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'course.position',
        'ASC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        'course.createdAt',
        'DESC',
      );
      expect(result.courses).toEqual([mockCourse]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(12);
    });

    it('should apply category filter', async () => {
      await service.findAll({ category: CourseCategory.FINANCIAL });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'course.category = :category',
        { category: CourseCategory.FINANCIAL },
      );
    });

    it('should apply level filter', async () => {
      await service.findAll({ level: CourseLevel.BEGINNER });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'course.level = :level',
        { level: CourseLevel.BEGINNER },
      );
    });

    it('should apply featured filter', async () => {
      await service.findAll({ featured: true });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'course.featured = :featured',
        { featured: true },
      );
    });

    it('should handle custom pagination', async () => {
      await service.findAll({ page: 2, limit: 6 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(6);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(6);
    });
  });

  describe('findBySlug', () => {
    it('should return course with published lessons via SQL filter', async () => {
      const courseWithPublishedOnly = {
        ...mockCourse,
        modules: [
          {
            id: 'module-1',
            title: 'Introduction',
            lessons: [
              { id: 'lesson-1', title: 'Welcome', published: true },
            ],
          },
        ],
      } as unknown as Course;

      mockQueryBuilder.getOne.mockResolvedValue(courseWithPublishedOnly);

      const result = await service.findBySlug('financial-planning-basics');

      expect(courseRepository.createQueryBuilder).toHaveBeenCalledWith('course');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'course.slug = :slug',
        { slug: 'financial-planning-basics' },
      );
      expect(result.modules[0].lessons).toHaveLength(1);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent-course')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new course with generated slug', async () => {
      const createDto = {
        title: 'Financial Planning Basics',
        description: 'Learn the basics',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        instructorName: 'Jane Smith',
        instructorBio: 'Expert',
        instructorPhoto: 'https://example.com/photo.jpg',
      };

      courseRepository.findOne.mockResolvedValue(null); // slug is unique
      courseRepository.create.mockReturnValue(mockCourse);
      courseRepository.save.mockResolvedValue(mockCourse);

      const result = await service.create(createDto as any);

      expect(courseRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'financial-planning-basics',
          published: false,
          featured: false,
        }),
      );
      expect(courseRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCourse);
    });
  });
});
