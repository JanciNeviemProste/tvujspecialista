import { Controller, Get, Patch, Query, Param, Body, UseGuards, Request } from '@nestjs/common';
import { SpecialistsService } from './specialists.service';
import { SpecialistFiltersDto } from './dto/specialist-filters.dto';
import { UpdateSpecialistDto } from './dto/update-specialist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('specialists')
export class SpecialistsController {
  constructor(private specialistsService: SpecialistsService) {}

  @Get()
  async findAll(@Query() filters: SpecialistFiltersDto) {
    return this.specialistsService.findAll(filters);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.specialistsService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  async getMyProfile(@Request() req) {
    return this.specialistsService.findByUserId(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Request() req, @Body() updateDto: UpdateSpecialistDto) {
    return this.specialistsService.update(req.user.userId, updateDto);
  }
}
