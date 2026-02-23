import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumCategory } from '../../database/entities/forum-category.entity';

@Injectable()
export class ForumCategoriesService {
  constructor(
    @InjectRepository(ForumCategory)
    private categoriesRepository: Repository<ForumCategory>,
  ) {}

  async findAll(): Promise<ForumCategory[]> {
    return this.categoriesRepository.find({
      order: { position: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<ForumCategory> {
    const category = await this.categoriesRepository.findOne({
      where: { slug },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
