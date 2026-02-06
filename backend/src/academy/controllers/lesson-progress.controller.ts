import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { LessonProgressService } from '../services/lesson-progress.service';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

@ApiTags('Academy - Progress')
@Controller('academy/progress')
export class LessonProgressController {
  constructor(private lessonProgressService: LessonProgressService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update lesson progress',
    description:
      'Records or updates progress for a specific lesson in an enrollment. ' +
      'Increments watch time, updates completion status, and recalculates overall enrollment progress.',
  })
  @ApiResponse({
    status: 201,
    description: 'Progress updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to update this enrollment',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment or lesson not found',
  })
  async updateProgress(
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.lessonProgressService.updateProgress(req.user.userId, dto);
  }

  @Get('enrollment/:enrollmentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all progress for an enrollment',
    description:
      'Retrieves all lesson progress records for a specific enrollment, ' +
      'ordered by module and lesson position.',
  })
  @ApiParam({
    name: 'enrollmentId',
    description: 'ID of the enrollment',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of progress records with lesson details',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to view this enrollment',
  })
  @ApiResponse({
    status: 404,
    description: 'Enrollment not found',
  })
  async getProgress(
    @Request() req: AuthenticatedRequest,
    @Param('enrollmentId') enrollmentId: string,
  ) {
    return this.lessonProgressService.getProgress(
      req.user.userId,
      enrollmentId,
    );
  }
}
