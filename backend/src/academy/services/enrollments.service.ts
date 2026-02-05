import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment, EnrollmentStatus } from '../../database/entities/enrollment.entity';
import { Course } from '../../database/entities/course.entity';
import { LessonProgress } from '../../database/entities/lesson-progress.entity';
import { QueryEnrollmentsDto } from '../dto/query-enrollments.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(LessonProgress)
    private lessonProgressRepository: Repository<LessonProgress>,
  ) {}

  async enroll(userId: string, courseId: string): Promise<Enrollment> {
    // 1. Validate course exists and is published
    const course = await this.courseRepository.findOne({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (!course.published) {
      throw new BadRequestException('Cannot enroll in unpublished course');
    }

    // 2. Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === EnrollmentStatus.ACTIVE) {
        throw new ConflictException('Already enrolled in this course');
      }
      if (existingEnrollment.status === EnrollmentStatus.COMPLETED) {
        throw new ConflictException('Already completed this course');
      }
      // If status is DROPPED, allow re-enrollment by updating the existing record
      existingEnrollment.status = EnrollmentStatus.ACTIVE;
      existingEnrollment.startedAt = new Date();
      existingEnrollment.lastAccessedAt = new Date();
      existingEnrollment.progress = 0;

      // Increment enrollment count
      await this.courseRepository.increment({ id: courseId }, 'enrollmentCount', 1);

      return this.enrollmentRepository.save(existingEnrollment);
    }

    // 3. Create new enrollment
    const enrollment = this.enrollmentRepository.create({
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
      progress: 0,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      certificateIssued: false,
    });

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    // 4. Increment course enrollment count
    await this.courseRepository.increment({ id: courseId }, 'enrollmentCount', 1);

    // 5. Return enrollment with course relation
    return this.enrollmentRepository.findOne({
      where: { id: savedEnrollment.id },
      relations: ['course'],
    });
  }

  async findMyEnrollments(
    userId: string,
    filters?: QueryEnrollmentsDto,
  ): Promise<Enrollment[]> {
    const query = this.enrollmentRepository
      .createQueryBuilder('enrollment')
      .leftJoinAndSelect('enrollment.course', 'course')
      .where('enrollment.userId = :userId', { userId });

    // Apply status filter if provided
    if (filters?.status) {
      query.andWhere('enrollment.status = :status', { status: filters.status });
    }

    // Order by last accessed date
    query.orderBy('enrollment.lastAccessedAt', 'DESC');

    return query.getMany();
  }

  async findById(enrollmentId: string, userId: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
      relations: ['course', 'lessonProgress', 'lessonProgress.lesson'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Verify ownership
    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to view this enrollment');
    }

    return enrollment;
  }

  async findByCourseId(userId: string, courseId: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: {
        userId,
        courseId,
      },
      relations: ['course', 'lessonProgress', 'lessonProgress.lesson'],
    });

    if (!enrollment) {
      throw new NotFoundException('Not enrolled in this course');
    }

    return enrollment;
  }

  async drop(enrollmentId: string, userId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Verify ownership
    if (enrollment.userId !== userId) {
      throw new ForbiddenException('Not authorized to modify this enrollment');
    }

    // Check if already dropped or completed
    if (enrollment.status === EnrollmentStatus.DROPPED) {
      throw new BadRequestException('Course already dropped');
    }

    if (enrollment.status === EnrollmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot drop a completed course');
    }

    // Update status to DROPPED
    enrollment.status = EnrollmentStatus.DROPPED;
    await this.enrollmentRepository.save(enrollment);

    // Decrement course enrollment count
    await this.courseRepository.decrement(
      { id: enrollment.courseId },
      'enrollmentCount',
      1,
    );
  }

  async updateProgress(enrollmentId: string): Promise<void> {
    // Find enrollment with lesson progress
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id: enrollmentId },
      relations: ['lessonProgress', 'course', 'course.modules', 'course.modules.lessons'],
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Count total published lessons in the course
    let totalLessons = 0;
    if (enrollment.course.modules) {
      enrollment.course.modules.forEach((module) => {
        if (module.lessons) {
          totalLessons += module.lessons.filter((lesson) => lesson.published).length;
        }
      });
    }

    if (totalLessons === 0) {
      enrollment.progress = 0;
      await this.enrollmentRepository.save(enrollment);
      return;
    }

    // Count completed lessons
    const completedLessons = enrollment.lessonProgress.filter(
      (progress) => progress.completed,
    ).length;

    // Calculate progress percentage
    const progressPercentage = (completedLessons / totalLessons) * 100;
    enrollment.progress = Math.round(progressPercentage * 100) / 100; // Round to 2 decimal places

    // If 100% complete, mark as completed
    if (progressPercentage === 100) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
    }

    await this.enrollmentRepository.save(enrollment);
  }
}
