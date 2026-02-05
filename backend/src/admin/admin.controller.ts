import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all users' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('specialists')
  @ApiOperation({ summary: 'Get all specialists (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all specialists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllSpecialists() {
    return this.adminService.getAllSpecialists();
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
  @ApiResponse({ status: 200, description: 'Returns all leads' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getAllLeads() {
    return this.adminService.getAllLeads();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns dashboard statistics' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats() {
    return this.adminService.getStats();
  }
}
