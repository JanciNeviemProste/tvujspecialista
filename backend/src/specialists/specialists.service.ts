import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specialist } from '../database/entities/specialist.entity';
import { Review } from '../database/entities/review.entity';
import { User } from '../database/entities/user.entity';
import { SpecialistFiltersDto } from './dto/specialist-filters.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';

@Injectable()
export class SpecialistsService {
  constructor(
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(filters: SpecialistFiltersDto) {
    const {
      category,
      location,
      minRating,
      verified,
      sortBy,
      page = 1,
      limit = 12,
    } = filters;

    const query = this.specialistRepository.createQueryBuilder('specialist');

    if (category) {
      query.andWhere('specialist.category = :category', { category });
    }

    if (location) {
      query.andWhere('specialist.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    if (filters.region) {
      query.andWhere(`specialist.regions @> :regionArr::jsonb`, {
        regionArr: JSON.stringify([filters.region]),
      });
    }

    if (minRating !== undefined) {
      query.andWhere('specialist.rating >= :minRating', { minRating });
    }

    if (verified !== undefined) {
      query.andWhere('specialist.verified = :verified', { verified });
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        query.orderBy('specialist.createdAt', 'DESC');
        break;
      case 'rating':
      default:
        query.orderBy('specialist.topSpecialist', 'DESC');
        query.addOrderBy('specialist.rating', 'DESC');
        query.addOrderBy('specialist.reviewsCount', 'DESC');
        break;
    }

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
    const specialist = await this.specialistRepository
      .createQueryBuilder('specialist')
      .leftJoinAndSelect(
        'specialist.reviews',
        'review',
        'review.published = :published',
        { published: true },
      )
      .where('specialist.slug = :slug', { slug })
      .addOrderBy('review.createdAt', 'DESC')
      .getOne();

    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    // Limit to 10 most recent reviews (already sorted DESC by createdAt)
    if (specialist.reviews && specialist.reviews.length > 10) {
      specialist.reviews = specialist.reviews.slice(0, 10);
    }

    return specialist;
  }

  async findByUserId(userId: string) {
    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
    if (!specialist) {
      throw new NotFoundException('Specialist profile not found');
    }
    return specialist;
  }

  async update(userId: string, updateDto: UpdateSpecialistDto) {
    const specialist = await this.findByUserId(userId);

    // Sync name to User entity if changed
    if (updateDto.name) {
      await this.userRepository.update(userId, { name: updateDto.name });
    }

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
