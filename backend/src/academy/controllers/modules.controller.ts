import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ModulesService } from '../services/modules.service';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Academy - Modules')
@Controller('academy')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get('courses/:courseId/modules')
  @ApiOperation({ summary: 'List all modules for a course' })
  @ApiResponse({ status: 200, description: 'Returns modules list' })
  async findByCourse(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(courseId);
  }

  @Get('modules/:id')
  @ApiOperation({ summary: 'Get module by ID with lessons' })
  @ApiResponse({ status: 200, description: 'Returns module details' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  async findById(@Param('id') id: string) {
    return this.modulesService.findById(id);
  }

  @Post('courses/:courseId/modules')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new module (admin only)' })
  @ApiResponse({ status: 201, description: 'Module created successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateModuleDto,
  ) {
    return this.modulesService.create(courseId, dto);
  }

  @Patch('modules/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update module (admin only)' })
  @ApiResponse({ status: 200, description: 'Module updated successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(id, dto);
  }

  @Delete('modules/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete module (admin only)' })
  @ApiResponse({ status: 200, description: 'Module deleted successfully' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async delete(@Param('id') id: string) {
    await this.modulesService.delete(id);
    return { message: 'Module deleted successfully' };
  }

  @Patch('modules/:id/reorder')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change module position (admin only)' })
  @ApiResponse({ status: 200, description: 'Module position updated' })
  @ApiResponse({ status: 404, description: 'Module not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async reorder(@Param('id') id: string, @Body('position') position: number) {
    await this.modulesService.reorder(id, position);
    return { message: 'Module position updated successfully' };
  }
}
