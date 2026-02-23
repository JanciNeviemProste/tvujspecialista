import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ForumTopicsService } from '../services/forum-topics.service';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { QueryTopicsDto } from '../dto/query-topics.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

@ApiTags('Forum - Topics')
@Controller('forum')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ForumTopicsController {
  constructor(private topicsService: ForumTopicsService) {}

  @Get('categories/:slug/topics')
  @ApiOperation({ summary: 'List topics in a category' })
  @ApiResponse({ status: 200, description: 'Returns paginated topic list' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findByCategory(
    @Param('slug') slug: string,
    @Query() query: QueryTopicsDto,
  ) {
    return this.topicsService.findByCategory(slug, query);
  }

  @Get('topics/:id')
  @ApiOperation({ summary: 'Get topic detail with posts' })
  @ApiResponse({ status: 200, description: 'Returns topic with all posts' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async findById(@Param('id') id: string) {
    return this.topicsService.findById(id);
  }

  @Post('topics')
  @ApiOperation({ summary: 'Create a new topic' })
  @ApiResponse({ status: 201, description: 'Topic created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateTopicDto,
  ) {
    return this.topicsService.create(req.user.userId, dto);
  }

  @Patch('topics/:id/pin')
  @ApiOperation({ summary: 'Pin/unpin topic (admin only)' })
  @ApiResponse({ status: 200, description: 'Topic pin status toggled' })
  @ApiResponse({ status: 403, description: 'Admin only' })
  async pin(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.topicsService.pin(id, req.user.userId, req.user.role);
  }

  @Patch('topics/:id/lock')
  @ApiOperation({ summary: 'Lock/unlock topic (admin only)' })
  @ApiResponse({ status: 200, description: 'Topic lock status toggled' })
  @ApiResponse({ status: 403, description: 'Admin only' })
  async lock(@Request() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.topicsService.lock(id, req.user.userId, req.user.role);
  }
}
