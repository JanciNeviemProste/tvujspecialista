import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get(':specialistId')
  async findBySpecialist(@Param('specialistId') specialistId: string) {
    return this.reviewsService.findBySpecialist(specialistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/all')
  async getMyReviews(@Request() req: AuthenticatedRequest) {
    return this.reviewsService.findMyReviews(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/respond')
  async respond(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() respondDto: RespondReviewDto,
  ) {
    return this.reviewsService.respond(id, req.user.userId, respondDto);
  }
}
