import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EnrollmentsService } from '../services/enrollments.service';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { QueryEnrollmentsDto } from '../dto/query-enrollments.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../guards/subscription.guard';

@ApiTags('Academy - Enrollments')
@Controller('academy/enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, SubscriptionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in a course' })
  @ApiResponse({ status: 201, description: 'Successfully enrolled in course' })
  @ApiResponse({ status: 400, description: 'Course not published' })
  @ApiResponse({ status: 403, description: 'Subscription required' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 409, description: 'Already enrolled in this course' })
  async enroll(@Request() req, @Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.enroll(req.user.userId, dto.courseId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my enrollments' })
  @ApiResponse({ status: 200, description: 'Returns list of user enrollments' })
  async findMyEnrollments(@Request() req, @Query() filters: QueryEnrollmentsDto) {
    return this.enrollmentsService.findMyEnrollments(req.user.userId, filters);
  }

  @Get('course/:courseId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enrollment by course ID' })
  @ApiResponse({ status: 200, description: 'Returns enrollment for the course' })
  @ApiResponse({ status: 404, description: 'Not enrolled in this course' })
  async findByCourseId(@Request() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourseId(req.user.userId, courseId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enrollment detail with progress' })
  @ApiResponse({ status: 200, description: 'Returns enrollment with course and progress details' })
  @ApiResponse({ status: 403, description: 'Not authorized to view this enrollment' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async findById(@Request() req, @Param('id') id: string) {
    return this.enrollmentsService.findById(id, req.user.userId);
  }

  @Patch(':id/drop')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Drop a course' })
  @ApiResponse({ status: 200, description: 'Course dropped successfully' })
  @ApiResponse({ status: 400, description: 'Cannot drop completed course' })
  @ApiResponse({ status: 403, description: 'Not authorized to modify this enrollment' })
  @ApiResponse({ status: 404, description: 'Enrollment not found' })
  async drop(@Request() req, @Param('id') id: string) {
    await this.enrollmentsService.drop(id, req.user.userId);
    return { message: 'Course dropped successfully' };
  }
}
