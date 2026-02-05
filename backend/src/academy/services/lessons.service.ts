import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../database/entities/lesson.entity';
import { Module as CourseModule } from '../../database/entities/module.entity';
import { Course } from '../../database/entities/course.entity';
import { Enrollment } from '../../database/entities/enrollment.entity';
import { CreateLessonDto } from '../dto/create-lesson.dto';
import { UpdateLessonDto } from '../dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(CourseModule)
    private moduleRepository: Repository<CourseModule>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async findByModule(moduleId: string): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: { moduleId },
      relations: ['video'],
      order: { position: 'ASC' },
    });
  }

  async findById(id: string, userId?: string): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['module', 'module.course', 'video'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // If lesson is not free and userId is provided, check enrollment
    if (!lesson.free && userId) {
      const courseId = lesson.module.course.id;
      const enrollment = await this.enrollmentRepository.findOne({
        where: { userId, courseId },
      });

      if (!enrollment) {
        throw new ForbiddenException(
          'Must be enrolled in course to access this lesson',
        );
      }
    }

    return lesson;
  }

  async create(moduleId: string, dto: CreateLessonDto): Promise<Lesson> {
    // Validate module exists
    const module = await this.moduleRepository.findOne({
      where: { id: moduleId },
      relations: ['course'],
    });
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    // Get max position for this module
    const maxPositionLesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.moduleId = :moduleId', { moduleId })
      .orderBy('lesson.position', 'DESC')
      .getOne();

    const position = maxPositionLesson ? maxPositionLesson.position + 1 : 1;

    // Create lesson
    const lesson = this.lessonRepository.create({
      ...dto,
      moduleId,
      position,
      published: false,
      free: dto.free || false,
    });

    const savedLesson = await this.lessonRepository.save(lesson);

    // Update module and course lessonCount
    await this.moduleRepository.increment(
      { id: moduleId },
      'lessonCount',
      1,
    );
    await this.courseRepository.increment(
      { id: module.courseId },
      'lessonCount',
      1,
    );

    return savedLesson;
  }

  async update(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    Object.assign(lesson, dto);
    return this.lessonRepository.save(lesson);
  }

  async delete(id: string): Promise<void> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['module'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const moduleId = lesson.moduleId;
    const module = lesson.module;

    // Delete lesson (cascade deletes video and lesson progress)
    await this.lessonRepository.delete(id);

    // Update module and course counts
    await this.moduleRepository.decrement({ id: moduleId }, 'lessonCount', 1);
    await this.courseRepository.decrement(
      { id: module.courseId },
      'lessonCount',
      1,
    );
  }

  async reorder(id: string, newPosition: number): Promise<void> {
    const lesson = await this.lessonRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const oldPosition = lesson.position;
    const moduleId = lesson.moduleId;

    // Update positions of other lessons in the same module
    if (newPosition < oldPosition) {
      // Moving up: shift lessons down
      await this.lessonRepository
        .createQueryBuilder()
        .update(Lesson)
        .set({ position: () => 'position + 1' })
        .where(
          'moduleId = :moduleId AND position >= :newPosition AND position < :oldPosition',
          { moduleId, newPosition, oldPosition },
        )
        .execute();
    } else if (newPosition > oldPosition) {
      // Moving down: shift lessons up
      await this.lessonRepository
        .createQueryBuilder()
        .update(Lesson)
        .set({ position: () => 'position - 1' })
        .where(
          'moduleId = :moduleId AND position > :oldPosition AND position <= :newPosition',
          { moduleId, oldPosition, newPosition },
        )
        .execute();
    }

    // Update this lesson's position
    lesson.position = newPosition;
    await this.lessonRepository.save(lesson);
  }
}
