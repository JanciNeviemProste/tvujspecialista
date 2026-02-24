import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { EventsService } from '../community/services/events.service';
import { RSVPsService } from '../community/services/rsvps.service';
import { CoursesService } from '../academy/services/courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly eventsService: EventsService,
    private readonly rsvpsService: RSVPsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllUsers(@Query() query: PaginationQueryDto) {
    return this.adminService.getAllUsers(query.page, query.limit);
  }

  @Get('specialists')
  @ApiOperation({ summary: 'Get all specialists (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated specialists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllSpecialists(@Query() query: PaginationQueryDto) {
    return this.adminService.getAllSpecialists(query.page, query.limit);
  }

  @Patch('specialists/:id/verify')
  @ApiOperation({ summary: 'Verify a specialist (Admin only)' })
  @ApiResponse({ status: 200, description: 'Specialist verified successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  async verifySpecialist(@Param('id') id: string) {
    return this.adminService.verifySpecialist(id);
  }

  @Get('leads')
  @ApiOperation({ summary: 'Get all leads (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns paginated leads' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllLeads(@Query() query: PaginationQueryDto) {
    return this.adminService.getAllLeads(query.page, query.limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get all courses including unpublished (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all courses' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllCourses() {
    return this.coursesService.findAllAdmin();
  }

  @Patch('courses/:id/publish')
  @ApiOperation({ summary: 'Publish/unpublish course (Admin only, no module validation)' })
  @ApiResponse({ status: 200, description: 'Course publish status updated' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async publishCourse(
    @Param('id') id: string,
    @Body('published') published: boolean,
  ) {
    return this.coursesService.publishAdmin(id, published);
  }

  @Get('events')
  @ApiOperation({ summary: 'Get all events including cancelled/unpublished (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all events' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllEvents() {
    return this.eventsService.findAllAdmin();
  }

  @Post('events/:id/publish')
  @ApiOperation({ summary: 'Publish/restore event (Admin only, no ownership check)' })
  @ApiResponse({ status: 200, description: 'Event publish status updated' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async publishEvent(
    @Param('id') id: string,
    @Body('published') published: boolean,
  ) {
    return this.eventsService.publishAdmin(id, published);
  }

  @Get('events/:id/attendees')
  @ApiOperation({ summary: 'Get event attendees (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns list of attendees' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventAttendees(@Param('id') id: string) {
    return this.eventsService.getAttendeesAdmin(id);
  }

  @Patch('rsvps/:id/status')
  @ApiOperation({ summary: 'Update RSVP status (Admin only)' })
  @ApiResponse({ status: 200, description: 'RSVP status updated' })
  @ApiResponse({ status: 404, description: 'RSVP not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async updateRSVPStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.rsvpsService.updateStatusAdmin(id, status as any);
  }
}
