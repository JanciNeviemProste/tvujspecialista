import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumTopic } from '../../database/entities/forum-topic.entity';
import { ForumCategory } from '../../database/entities/forum-category.entity';
import { CreateTopicDto } from '../dto/create-topic.dto';
import { QueryTopicsDto } from '../dto/query-topics.dto';
import { UserRole } from '../../database/entities/user.entity';

@Injectable()
export class ForumTopicsService {
  constructor(
    @InjectRepository(ForumTopic)
    private topicsRepository: Repository<ForumTopic>,
    @InjectRepository(ForumCategory)
    private categoriesRepository: Repository<ForumCategory>,
  ) {}

  async findByCategory(
    categorySlug: string,
    query: QueryTopicsDto,
  ): Promise<{ topics: ForumTopic[]; total: number; page: number; limit: number }> {
    const category = await this.categoriesRepository.findOne({
      where: { slug: categorySlug },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const page = query.page || 1;
    const limit = query.limit || 20;

    const qb = this.topicsRepository
      .createQueryBuilder('topic')
      .leftJoinAndSelect('topic.author', 'author')
      .where('topic.categoryId = :categoryId', { categoryId: category.id })
      .orderBy('topic.isPinned', 'DESC')
      .addOrderBy('topic.lastReplyAt', 'DESC', 'NULLS LAST')
      .addOrderBy('topic.createdAt', 'DESC');

    if (query.search) {
      qb.andWhere('(topic.title ILIKE :search OR topic.content ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const total = await qb.getCount();
    const topics = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { topics, total, page, limit };
  }

  async findById(id: string): Promise<ForumTopic> {
    const topic = await this.topicsRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'posts', 'posts.author'],
    });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    // Increment view count
    await this.topicsRepository.increment({ id }, 'viewCount', 1);
    topic.viewCount += 1;

    return topic;
  }

  async create(userId: string, dto: CreateTopicDto): Promise<ForumTopic> {
    const category = await this.categoriesRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Generate unique slug
    const baseSlug = dto.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const topic = this.topicsRepository.create({
      categoryId: dto.categoryId,
      authorId: userId,
      title: dto.title,
      slug,
      content: dto.content,
    });

    const saved = await this.topicsRepository.save(topic);

    // Increment category topic count
    await this.categoriesRepository.increment({ id: dto.categoryId }, 'topicCount', 1);

    return this.findById(saved.id);
  }

  async pin(id: string, userId: string, role: UserRole): Promise<ForumTopic> {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can pin topics');
    }

    const topic = await this.topicsRepository.findOne({ where: { id } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    topic.isPinned = !topic.isPinned;
    return this.topicsRepository.save(topic);
  }

  async lock(id: string, userId: string, role: UserRole): Promise<ForumTopic> {
    if (role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can lock topics');
    }

    const topic = await this.topicsRepository.findOne({ where: { id } });
    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    topic.isLocked = !topic.isLocked;
    return this.topicsRepository.save(topic);
  }
}
