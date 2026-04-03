import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Review } from '../database/entities/review.entity';
import { ReviewToken } from '../database/entities/review-token.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { User } from '../database/entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { SpecialistsService } from '../specialists/specialists.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewToken)
    private reviewTokenRepository: Repository<ReviewToken>,
    @InjectRepository(Specialist)
    private specialistRepository: Repository<Specialist>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private specialistsService: SpecialistsService,
    private emailService: EmailService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const token = await this.reviewTokenRepository.findOne({
      where: { token: createReviewDto.token },
    });

    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    if (token.used) {
      throw new BadRequestException('Token already used');
    }

    if (token.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    if (token.customerEmail !== createReviewDto.customerEmail) {
      throw new BadRequestException('Email does not match token');
    }

    const review = this.reviewRepository.create({
      specialistId: token.specialistId,
      customerName: createReviewDto.customerName,
      customerEmail: createReviewDto.customerEmail,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      verified: true,
      published: true,
    });

    const savedReview = await this.reviewRepository.save(review);

    token.used = true;
    await this.reviewTokenRepository.save(token);

    await this.specialistsService.calculateRating(token.specialistId);

    return savedReview;
  }

  async findBySpecialist(specialistId: string) {
    return this.reviewRepository.find({
      where: { specialistId, published: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findMyReviews(userId: string) {
    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    return this.reviewRepository.find({
      where: { specialistId: specialist.id },
      order: { createdAt: 'DESC' },
    });
  }

  async respond(
    reviewId: string,
    userId: string,
    respondDto: RespondReviewDto,
  ) {
    const specialist = await this.specialistRepository.findOne({
      where: { userId },
    });
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.specialistId !== specialist.id) {
      throw new BadRequestException('Unauthorized');
    }

    review.specialistResponse = respondDto.response;
    review.respondedAt = new Date();

    return this.reviewRepository.save(review);
  }

  async requestReviewByEmail(userId: string, customerEmail: string): Promise<void> {
    const specialist = await this.specialistRepository.findOne({ where: { userId } });
    if (!specialist) {
      throw new NotFoundException('Specialist not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const locale = user?.locale || 'cs';

    const reviewToken = await this.createReviewToken(specialist.id, null, customerEmail);
    await this.emailService.sendReviewRequest(
      customerEmail,
      specialist.name,
      reviewToken.token,
      locale,
    );
  }

  async createReviewToken(
    specialistId: string,
    leadId: string | null,
    customerEmail: string,
  ) {
    const token = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const reviewToken = this.reviewTokenRepository.create({
      token,
      specialistId,
      leadId,
      customerEmail,
      expiresAt,
    });

    return this.reviewTokenRepository.save(reviewToken);
  }
}
