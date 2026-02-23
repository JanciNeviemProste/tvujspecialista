import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ForumCategoriesService } from '../services/forum-categories.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Forum - Categories')
@Controller('forum/categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ForumCategoriesController {
  constructor(private categoriesService: ForumCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all forum categories' })
  @ApiResponse({ status: 200, description: 'Returns list of forum categories' })
  async findAll() {
    return this.categoriesService.findAll();
  }
}
