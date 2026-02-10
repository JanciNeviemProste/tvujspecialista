import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from '../../database/entities/lesson-progress.entity';
import { Enrollment } from '../../database/entities/enrollment.entity';
import { Lesson } from '../../database/entities/lesson.entity';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { EnrollmentsService } from './enrollments.service';

@Injectable()
export class LessonProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    private enrollmentsService: EnrollmentsService,
  ) {}

  async updateProgress(
    userId: string,
    dto: UpdateProgressDto,
  ): Promise<LessonProgress> {
    const { enrollmentId, lessonId, watchTimeSeconds, completed, notes } = dto;

    // 1. Verify enrollment exists and belongs to userId
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to update this enrollment');
    }

    // 2. Verify lesson exists
    const lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Validate watch time
    if (watchTimeSeconds < 0) {
      throw new BadRequestException('Watch time cannot be negative');
    }

    // 3. Find or create LessonProgress record
    let progress = await this.lessonProgressRepository.findOne({
      where: {
        enrollmentId,
        lessonId,
      },
    });

    const now = new Date();

    if (progress) {
      // 4. Update existing progress - increment watchTimeSeconds
      progress.watchTimeSeconds += watchTimeSeconds;
      progress.lastWatchedAt = now;

      // 5. Update completed flag if provided
      if (completed !== undefined) {
        // Only set to true if not already completed
        if (completed && !progress.completed) {
          progress.completed = true;
          progress.completedAt = now;
        }
        // Don't allow un-completing once completed
        // This preserves completion state
      }

      // 6. Update notes if provided
      if (notes !== undefined) {
        progress.notes = notes;
      }
    } else {
      // Create new progress record
      progress = this.lessonProgressRepository.create({
        enrollmentId,
        lessonId,
        watchTimeSeconds,
        completed: completed || false,
        completedAt: completed ? now : undefined,
        lastWatchedAt: now,
        notes: notes || undefined,
      } as Partial<LessonProgress>);
    }

    // 8. Save LessonProgress
    const savedProgress = await this.lessonProgressRepository.save(progress);

    // 9. Update enrollment.lastAccessedAt
    enrollment.lastAccessedAt = now;
    await this.enrollmentRepository.save(enrollment);

    // 10. Call enrollmentsService.updateProgress to recalculate percentage
    await this.enrollmentsService.updateProgress(enrollmentId);

    // 11. Return updated LessonProgress with lesson relation
    const result = await this.lessonProgressRepository.findOne({
      where: { id: savedProgress.id },
      relations: ['lesson'],
    });

    if (!result) {
      throw new NotFoundException('Progress not found after save');
    }

    return result;
  }

  async getProgress(
    userId: string,
    enrollmentId: string,
  ): Promise<LessonProgress[]> {
    // 1. Verify enrollment belongs to userId
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to view this enrollment');
    }

    // 2. Find all LessonProgress for enrollment
    // 3. Return with lesson relations
    // 4. Order by lesson.position
    const progressRecords = await this.lessonProgressRepository
      .createQueryBuilder('progress')
      .leftJoinAndSelect('progress.lesson', 'lesson')
      .leftJoinAndSelect('lesson.module', 'module')
      .where('progress.enrollmentId = :enrollmentId', { enrollmentId })
      .orderBy('module.position', 'ASC')
      .addOrderBy('lesson.position', 'ASC')
      .getMany();

    return progressRecords;
  }
}
