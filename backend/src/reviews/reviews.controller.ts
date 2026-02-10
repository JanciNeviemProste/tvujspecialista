import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a review for a specialist' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get(':specialistId')
  @ApiOperation({ summary: 'Get reviews for a specialist' })
  @ApiResponse({ status: 200, description: 'Returns specialist reviews' })
  async findBySpecialist(@Param('specialistId') specialistId: string) {
    return this.reviewsService.findBySpecialist(specialistId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews as specialist' })
  @ApiResponse({ status: 200, description: 'Returns my reviews' })
  async getMyReviews(@Request() req: AuthenticatedRequest) {
    return this.reviewsService.findMyReviews(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/respond')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Respond to a review' })
  @ApiResponse({ status: 200, description: 'Response added to review' })
  async respond(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() respondDto: RespondReviewDto,
  ) {
    return this.reviewsService.respond(id, req.user.userId, respondDto);
  }
}
