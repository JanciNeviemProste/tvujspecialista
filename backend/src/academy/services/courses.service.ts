import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../../database/entities/course.entity';
import { Module as CourseModule } from '../../database/entities/module.entity';
import { CreateCourseDto } from '../dto/create-course.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { QueryCoursesDto } from '../dto/query-courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(CourseModule)
    private moduleRepository: Repository<CourseModule>,
  ) {}

  async findAll(filters: QueryCoursesDto): Promise<{
    courses: Course[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = this.courseRepository.createQueryBuilder('course');

    // Always filter by published for public access
    query.where('course.published = :published', { published: true });

    // Apply filters
    if (filters.category) {
      query.andWhere('course.category = :category', {
        category: filters.category,
      });
    }
    if (filters.level) {
      query.andWhere('course.level = :level', { level: filters.level });
    }
    if (filters.featured !== undefined) {
      query.andWhere('course.featured = :featured', {
        featured: filters.featured,
      });
    }

    // Order by position, then by createdAt
    query.orderBy('course.position', 'ASC');
    query.addOrderBy('course.createdAt', 'DESC');

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [courses, total] = await query.getManyAndCount();

    return { courses, total, page, limit };
  }

  async findBySlug(slug: string): Promise<Course> {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect('course.modules', 'module')
      .leftJoinAndSelect('module.lessons', 'lesson', 'lesson.published = :pub', { pub: true })
      .where('course.slug = :slug', { slug })
      .andWhere('course.published = :published', { published: true })
      .orderBy('module.position', 'ASC')
      .addOrderBy('lesson.position', 'ASC')
      .getOne();

    if (!course) {
      throw new NotFoundException('Course not found or not available');
    }

    return course;
  }

  async create(dto: CreateCourseDto): Promise<Course> {
    // Generate slug from title
    let slug = this.generateSlug(dto.title);

    // Ensure slug is unique
    const existingCourse = await this.courseRepository.findOne({
      where: { slug },
    });
    if (existingCourse) {
      // Append timestamp to make it unique
      slug = `${slug}-${Date.now()}`;
    }

    // Create course
    const course = this.courseRepository.create({
      ...dto,
      slug,
      published: false,
      featured: false,
      position: dto.position || 0,
      moduleCount: 0,
      lessonCount: 0,
      enrollmentCount: 0,
      rating: 0,
      reviewCount: 0,
    });

    return this.courseRepository.save(course);
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // If title changed, regenerate slug
    if (dto.title && dto.title !== course.title) {
      let newSlug = this.generateSlug(dto.title);

      // Ensure new slug is unique (excluding current course)
      const existingCourse = await this.courseRepository
        .createQueryBuilder('course')
        .where('course.slug = :slug AND course.id != :id', {
          slug: newSlug,
          id,
        })
        .getOne();

      if (existingCourse) {
        newSlug = `${newSlug}-${Date.now()}`;
      }

      course.slug = newSlug;
    }

    // Update fields
    Object.assign(course, dto);

    return this.courseRepository.save(course);
  }

  async delete(id: string): Promise<void> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['enrollments'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if course has enrollments
    if (course.enrollments && course.enrollments.length > 0) {
      throw new BadRequestException(
        'Cannot delete course with active enrollments',
      );
    }

    await this.courseRepository.delete(id);
  }

  async publish(id: string, published: boolean): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['modules', 'modules.lessons'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // If publishing, validate that course is ready
    if (published) {
      if (!course.modules || course.modules.length === 0) {
        throw new BadRequestException(
          'Course must have at least one module before publishing',
        );
      }

      const hasLessons = course.modules.some(
        (module) => module.lessons && module.lessons.length > 0,
      );
      if (!hasLessons) {
        throw new BadRequestException(
          'Course must have at least one lesson before publishing',
        );
      }
    }

    course.published = published;
    return this.courseRepository.save(course);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
}
