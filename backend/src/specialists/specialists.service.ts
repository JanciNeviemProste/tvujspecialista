import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../database/entities/specialist.entity';
import { Review } from '../database/entities/review.entity';
import { SpecialistFiltersDto } from './dto/specialist-filters.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Injectable()
export class SpecialistsService {
  constructor(
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async findAll(filters: SpecialistFiltersDto) {
    const { category, location, minRating, maxPrice, page = 1, limit = 12 } = filters;

    const query = this.specialistRepository.createQueryBuilder('specialist');

    if (category) {
      query.andWhere('specialist.category = :category', { category });
    }

    if (location) {
      query.andWhere('specialist.location ILIKE :location', { location: `%${location}%` });
    }

    if (minRating !== undefined) {
      query.andWhere('specialist.rating >= :minRating', { minRating });
    }

    if (maxPrice !== undefined) {
      query.andWhere('specialist.hourlyRate <= :maxPrice', { maxPrice });
    }

    query.orderBy('specialist.topSpecialist', 'DESC');
    query.addOrderBy('specialist.rating', 'DESC');
    query.addOrderBy('specialist.reviewsCount', 'DESC');

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [specialists, total] = await query.getManyAndCount();

    return {
      specialists,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    const specialist = await this.specialistRepository.findOne({ where: { slug } });
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    const reviews = await this.reviewRepository.find({
      where: { specialistId: specialist.id, published: true },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      ...specialist,
      reviews,
    };
  }

  async findByUserId(userId: string) {
    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist) {
      throw new NotFoundException('Specialist profile not found');
    }
    return specialist;
  }

  async update(userId: string, updateDto: UpdateSpecialistDto) {
    const specialist = await this.findByUserId(userId);

    Object.assign(specialist, updateDto);

    return this.specialistRepository.save(specialist);
  }

  async calculateRating(specialistId: string) {
    const reviews = await this.reviewRepository.find({
      where: { specialistId, published: true },
    });

    if (reviews.length === 0) {
      return { rating: 0, reviewsCount: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const rating = Math.round((totalRating / reviews.length) * 10) / 10;

    await this.specialistRepository.update(specialistId, {
      rating,
      reviewsCount: reviews.length,
    });

    return { rating, reviewsCount: reviews.length };
  }
}
