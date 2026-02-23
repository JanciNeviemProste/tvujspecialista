import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumPost } from '../../database/entities/forum-post.entity';
import { ForumTopic } from '../../database/entities/forum-topic.entity';
import { ForumLike } from '../../database/entities/forum-like.entity';
import { CreatePostDto } from '../dto/create-post.dto';

@Injectable()
export class ForumPostsService {
  constructor(
    @InjectRepository(ForumPost)
    private postsRepository: Repository<ForumPost>,
    @InjectRepository(ForumTopic)
    private topicsRepository: Repository<ForumTopic>,
    @InjectRepository(ForumLike)
    private likesRepository: Repository<ForumLike>,
  ) {}

  async create(userId: string, topicId: string, dto: CreatePostDto): Promise<ForumPost> {
    const topic = await this.topicsRepository.findOne({ where: { id: topicId } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }
    if (topic.isLocked) {
      throw new BadRequestException('This topic is locked');
    }

    const post = this.postsRepository.create({
      topicId,
      authorId: userId,
      content: dto.content,
    });

    const saved = await this.postsRepository.save(post);

    // Update topic reply count and lastReplyAt
    await this.topicsRepository.update(topicId, {
      replyCount: () => '"replyCount" + 1',
      lastReplyAt: new Date(),
    });

    const result = await this.postsRepository.findOne({
      where: { id: saved.id },
      relations: ['author'],
    });
    return result!;
  }

  async delete(id: string, userId: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['topic'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    const topicId = post.topicId;
    await this.postsRepository.remove(post);

    // Decrement topic reply count
    await this.topicsRepository.update(topicId, {
      replyCount: () => 'GREATEST("replyCount" - 1, 0)',
    });
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      // Unlike
      await this.likesRepository.remove(existingLike);
      await this.postsRepository.update(postId, {
        likesCount: () => 'GREATEST("likesCount" - 1, 0)',
      });
      const updated = await this.postsRepository.findOne({ where: { id: postId } });
      return { liked: false, likesCount: updated?.likesCount ?? 0 };
    } else {
      // Like
      const like = this.likesRepository.create({ postId, userId });
      await this.likesRepository.save(like);
      await this.postsRepository.update(postId, {
        likesCount: () => '"likesCount" + 1',
      });
      const updated = await this.postsRepository.findOne({ where: { id: postId } });
      return { liked: true, likesCount: updated?.likesCount ?? 0 };
    }
  }
}
