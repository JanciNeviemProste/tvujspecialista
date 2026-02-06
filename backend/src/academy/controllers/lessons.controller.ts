import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LessonsService } from '../services/lessons.service';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

@ApiTags('Academy - Lessons')
@Controller('academy')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get('modules/:moduleId/lessons')
  @ApiOperation({ summary: 'List all lessons for a module' })
  @ApiResponse({ status: 200, description: 'Returns lessons list' })
  async findByModule(@Param('moduleId') moduleId: string) {
    return this.lessonsService.findByModule(moduleId);
  }

  @Get('lessons/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get lesson by ID (requires enrollment if not free)',
  })
  @ApiResponse({ status: 200, description: 'Returns lesson details' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 403, description: 'Enrollment required' })
  async findById(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.lessonsService.findById(id, req.user.userId);
  }

  @Post('modules/:moduleId/lessons')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new lesson (admin only)' })
  @ApiResponse({ status: 201, description: 'Lesson created successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateLessonDto,
  ) {
    return this.lessonsService.create(moduleId, dto);
  }

  @Patch('lessons/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update lesson (admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson updated successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete('lessons/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete lesson (admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async delete(@Param('id') id: string) {
    await this.lessonsService.delete(id);
    return { message: 'Lesson deleted successfully' };
  }

  @Patch('lessons/:id/reorder')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change lesson position (admin only)' })
  @ApiResponse({ status: 200, description: 'Lesson position updated' })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async reorder(@Param('id') id: string, @Body('position') position: number) {
    await this.lessonsService.reorder(id, position);
    return { message: 'Lesson position updated successfully' };
  }
}
