import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
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
  constructor(private readonly adminService: AdminService) {}

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
}
