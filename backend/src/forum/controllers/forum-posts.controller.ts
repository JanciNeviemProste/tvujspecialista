import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ForumPostsService } from '../services/forum-posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../../auth/interfaces/authenticated-request.interface';

@ApiTags('Forum - Posts')
@Controller('forum')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ForumPostsController {
  constructor(private postsService: ForumPostsService) {}

  @Post('topics/:topicId/posts')
  @ApiOperation({ summary: 'Reply to a topic' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 400, description: 'Topic is locked' })
  @ApiResponse({ status: 404, description: 'Topic not found' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Param('topicId') topicId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(req.user.userId, topicId, dto);
  }

  @Delete('posts/:id')
  @ApiOperation({ summary: 'Delete own post' })
  @ApiResponse({ status: 200, description: 'Post deleted' })
  @ApiResponse({ status: 403, description: 'Can only delete own posts' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async delete(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.postsService.delete(id, req.user.userId);
    return { message: 'Post deleted successfully' };
  }

  @Post('posts/:id/like')
  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiResponse({ status: 200, description: 'Like toggled' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async toggleLike(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.postsService.toggleLike(id, req.user.userId);
  }
}
