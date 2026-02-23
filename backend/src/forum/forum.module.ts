import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumCategoriesController } from './controllers/forum-categories.controller';
import { ForumTopicsController } from './controllers/forum-topics.controller';
import { ForumPostsController } from './controllers/forum-posts.controller';
import { ForumCategoriesService } from './services/forum-categories.service';
import { ForumTopicsService } from './services/forum-topics.service';
import { ForumPostsService } from './services/forum-posts.service';
import { ForumCategory } from '../database/entities/forum-category.entity';
import { ForumTopic } from '../database/entities/forum-topic.entity';
import { ForumPost } from '../database/entities/forum-post.entity';
import { ForumLike } from '../database/entities/forum-like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForumCategory, ForumTopic, ForumPost, ForumLike]),
  ],
  controllers: [
    ForumCategoriesController,
    ForumTopicsController,
    ForumPostsController,
  ],
  providers: [ForumCategoriesService, ForumTopicsService, ForumPostsService],
  exports: [ForumCategoriesService, ForumTopicsService, ForumPostsService],
})
export class ForumModule {}
