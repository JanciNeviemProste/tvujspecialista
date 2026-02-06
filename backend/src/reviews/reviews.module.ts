import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from '../database/entities/review.entity';
import { ReviewToken } from '../database/entities/review-token.entity';
import { Specialist } from '../database/entities/specialist.entity';
import { SpecialistsModule } from '../specialists/specialists.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewToken, Specialist]),
    SpecialistsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
