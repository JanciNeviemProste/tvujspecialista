import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import {
  Specialist,
  SpecialistCategory,
} from '../database/entities/specialist.entity';
import { Review } from '../database/entities/review.entity';

describe('SpecialistsService', () => {
  let service: SpecialistsService;
  let specialistRepository: jest.Mocked<Repository<Specialist>>;
  let reviewRepository: jest.Mocked<Repository<Review>>;

  const mockSpecialist = {
    id: 'specialist-123',
    userId: 'user-123',
    slug: 'john-doe-finance-prague',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+420123456789',
    category: SpecialistCategory.FINANCIAL_ADVISOR,
    location: 'Prague',
    bio: 'Experienced financial advisor',
    yearsExperience: 5,
    hourlyRate: 1500,
    rating: 4.5,
    reviewsCount: 10,
    topSpecialist: false,
    verified: true,
    services: ['Financial planning'],
    certifications: ['CFP'],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as unknown as Specialist;

  const mockReviews = [
    {
      id: 'review-1',
      specialistId: 'specialist-123',
      customerName: 'Alice',
      customerEmail: 'alice@example.com',
      rating: 5,
      comment: 'Great advisor',
      published: true,
      createdAt: new Date(),
    },
    {
      id: 'review-2',
      specialistId: 'specialist-123',
      customerName: 'Bob',
      customerEmail: 'bob@example.com',
      rating: 4,
      comment: 'Good service',
      published: true,
      createdAt: new Date(),
    },
  ] as Review[];

  // Mock query builder
  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockSpecialist], 1]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpecialistsService,
        {
          provide: getRepositoryToken(Specialist),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
          },
        },
        {
          provide: getRepositoryToken(Review),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpecialistsService>(SpecialistsService);
    specialistRepository = module.get(getRepositoryToken(Specialist));
    reviewRepository = module.get(getRepositoryToken(Review));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated specialists with no filters', async () => {
      const result = await service.findAll({ page: 1, limit: 12 });

      expect(specialistRepository.createQueryBuilder).toHaveBeenCalledWith(
        'specialist',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'specialist.topSpecialist',
        'DESC',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(12);
      expect(result.specialists).toEqual([mockSpecialist]);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(12);
      expect(result.totalPages).toBe(1);
    });

    it('should apply category filter', async () => {
      await service.findAll({
        category: SpecialistCategory.FINANCIAL_ADVISOR,
        page: 1,
        limit: 12,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'specialist.category = :category',
        { category: SpecialistCategory.FINANCIAL_ADVISOR },
      );
    });

    it('should apply location filter', async () => {
      await service.findAll({ location: 'Prague', page: 1, limit: 12 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'specialist.location ILIKE :location',
        { location: '%Prague%' },
      );
    });

    it('should apply minRating filter', async () => {
      await service.findAll({ minRating: 4, page: 1, limit: 12 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'specialist.rating >= :minRating',
        { minRating: 4 },
      );
    });

    it('should apply maxPrice filter', async () => {
      await service.findAll({ maxPrice: 2000, page: 1, limit: 12 });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'specialist.hourlyRate <= :maxPrice',
        { maxPrice: 2000 },
      );
    });
  });

  describe('findBySlug', () => {
    it('should return specialist with reviews', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      reviewRepository.find.mockResolvedValue(mockReviews);

      const result = await service.findBySlug('john-doe-finance-prague');

      expect(specialistRepository.findOne).toHaveBeenCalledWith({
        where: { slug: 'john-doe-finance-prague' },
      });
      expect(reviewRepository.find).toHaveBeenCalledWith({
        where: { specialistId: 'specialist-123', published: true },
        order: { createdAt: 'DESC' },
        take: 10,
      });
      expect(result).toEqual({ ...mockSpecialist, reviews: mockReviews });
    });

    it('should throw NotFoundException if specialist not found', async () => {
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent-slug')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findBySlug('nonexistent-slug')).rejects.toThrow(
        'Specialist not found',
      );
    });
  });

  describe('findByUserId', () => {
    it('should return specialist by userId', async () => {
      specialistRepository.findOne.mockResolvedValue(mockSpecialist);

      const result = await service.findByUserId('user-123');

      expect(specialistRepository.findOne).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
      expect(result).toEqual(mockSpecialist);
    });

    it('should throw NotFoundException if specialist profile not found', async () => {
      specialistRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUserId('nonexistent-user')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByUserId('nonexistent-user')).rejects.toThrow(
        'Specialist profile not found',
      );
    });
  });

  describe('update', () => {
    it('should update specialist profile', async () => {
      const updateDto = { bio: 'Updated bio', hourlyRate: 2000 };
      const updatedSpecialist = { ...mockSpecialist, ...updateDto };

      specialistRepository.findOne.mockResolvedValue(mockSpecialist);
      specialistRepository.save.mockResolvedValue(
        updatedSpecialist as Specialist,
      );

      const result = await service.update('user-123', updateDto);

      expect(specialistRepository.save).toHaveBeenCalled();
      expect(result.bio).toBe('Updated bio');
      expect(result.hourlyRate).toBe(2000);
    });
  });

  describe('calculateRating', () => {
    it('should calculate and update rating', async () => {
      reviewRepository.find.mockResolvedValue(mockReviews);
      specialistRepository.update.mockResolvedValue({} as any);

      const result = await service.calculateRating('specialist-123');

      expect(reviewRepository.find).toHaveBeenCalledWith({
        where: { specialistId: 'specialist-123', published: true },
      });
      expect(result.rating).toBe(4.5);
      expect(result.reviewsCount).toBe(2);
      expect(specialistRepository.update).toHaveBeenCalledWith(
        'specialist-123',
        {
          rating: 4.5,
          reviewsCount: 2,
        },
      );
    });

    it('should return zero rating when no reviews exist', async () => {
      reviewRepository.find.mockResolvedValue([]);

      const result = await service.calculateRating('specialist-123');

      expect(result.rating).toBe(0);
      expect(result.reviewsCount).toBe(0);
    });
  });
});
