import {
  Controller,
  Get,
  Patch,
  Query,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SpecialistsService } from './specialists.service';
import { SpecialistFiltersDto } from './dto/specialist-filters.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { SpecialistResponseDto } from './dto/specialist-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/interfaces/authenticated-request.interface';

@ApiTags('Specialists')
@Controller('specialists')
@UseInterceptors(ClassSerializerInterceptor)
export class SpecialistsController {
  constructor(private specialistsService: SpecialistsService) {}

  @Get()
  @ApiOperation({ summary: 'Search specialists with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated specialists', type: [SpecialistResponseDto] })
  async findAll(@Query() filters: SpecialistFiltersDto) {
    return this.specialistsService.findAll(filters);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get specialist by slug' })
  @ApiResponse({ status: 200, description: 'Returns specialist with reviews', type: SpecialistResponseDto })
  @ApiResponse({ status: 404, description: 'Specialist not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.specialistsService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my specialist profile' })
  @ApiResponse({ status: 200, description: 'Returns specialist profile', type: SpecialistResponseDto })
  async getMyProfile(@Request() req: AuthenticatedRequest) {
    return this.specialistsService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my specialist profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: SpecialistResponseDto })
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateDto: UpdateSpecialistDto,
  ) {
    return this.specialistsService.update(req.user.userId, updateDto);
  }
}
