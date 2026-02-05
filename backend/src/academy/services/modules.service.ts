import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module as CourseModule } from '../../database/entities/module.entity';
import { Course } from '../../database/entities/course.entity';
import { CreateModuleDto } from '../dto/create-module.dto';
import { UpdateModuleDto } from '../dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(CourseModule)
    private moduleRepository: Repository<CourseModule>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async findByCourse(courseId: string): Promise<CourseModule[]> {
    return this.moduleRepository.find({
      where: { courseId },
      relations: ['lessons'],
      order: { position: 'ASC' },
    });
  }

  async findById(id: string): Promise<CourseModule> {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['course', 'lessons', 'lessons.video'],
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async create(courseId: string, dto: CreateModuleDto): Promise<CourseModule> {
    // Validate course exists
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Get max position for this course
    let position = dto.position;
    if (position === undefined) {
      const maxPositionModule = await this.moduleRepository
        .createQueryBuilder('module')
        .where('module.courseId = :courseId', { courseId })
        .orderBy('module.position', 'DESC')
        .getOne();

      position = maxPositionModule ? maxPositionModule.position + 1 : 1;
    }

    // Create module
    const module = this.moduleRepository.create({
      ...dto,
      courseId,
      position,
      lessonCount: 0,
      duration: 0,
    });

    const savedModule = await this.moduleRepository.save(module);

    // Update course moduleCount
    await this.courseRepository.increment({ id: courseId }, 'moduleCount', 1);

    return savedModule;
  }

  async update(id: string, dto: UpdateModuleDto): Promise<CourseModule> {
    const module = await this.moduleRepository.findOne({ where: { id } });
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    Object.assign(module, dto);
    return this.moduleRepository.save(module);
  }

  async delete(id: string): Promise<void> {
    const module = await this.moduleRepository.findOne({
      where: { id },
      relations: ['lessons'],
    });

    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const courseId = module.courseId;
    const lessonCount = module.lessons ? module.lessons.length : 0;

    // Delete module (cascade deletes lessons)
    await this.moduleRepository.delete(id);

    // Update course counts
    await this.courseRepository.decrement(
      { id: courseId },
      'moduleCount',
      1,
    );
    await this.courseRepository.decrement(
      { id: courseId },
      'lessonCount',
      lessonCount,
    );
  }

  async reorder(id: string, newPosition: number): Promise<void> {
    const module = await this.moduleRepository.findOne({ where: { id } });
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    const oldPosition = module.position;
    const courseId = module.courseId;

    // Update positions of other modules in the same course
    if (newPosition < oldPosition) {
      // Moving up: shift modules down
      await this.moduleRepository
        .createQueryBuilder()
        .update(CourseModule)
        .set({ position: () => 'position + 1' })
        .where(
          'courseId = :courseId AND position >= :newPosition AND position < :oldPosition',
          { courseId, newPosition, oldPosition },
        )
        .execute();
    } else if (newPosition > oldPosition) {
      // Moving down: shift modules up
      await this.moduleRepository
        .createQueryBuilder()
        .update(CourseModule)
        .set({ position: () => 'position - 1' })
        .where(
          'courseId = :courseId AND position > :oldPosition AND position <= :newPosition',
          { courseId, oldPosition, newPosition },
        )
        .execute();
    }

    // Update this module's position
    module.position = newPosition;
    await this.moduleRepository.save(module);
  }
}
