import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { QueryCoursesDto } from '../dto/query-courses.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Academy - Courses')
@Controller('academy/courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List all published courses' })
  @ApiResponse({ status: 200, description: 'Returns paginated course list' })
  async findAll(@Query() filters: QueryCoursesDto) {
    return this.coursesService.findAll(filters);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get course by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns course with modules and lessons',
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new course (admin only)' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course (admin only)' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course (admin only)' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete course with enrollments',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async delete(@Param('id') id: string) {
    await this.coursesService.delete(id);
    return { message: 'Course deleted successfully' };
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish/unpublish course (admin only)' })
  @ApiResponse({ status: 200, description: 'Course publish status updated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 400, description: 'Course not ready for publishing' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async publish(
    @Param('id') id: string,
    @Body('published') published: boolean,
  ) {
    return this.coursesService.publish(id, published);
  }
}
