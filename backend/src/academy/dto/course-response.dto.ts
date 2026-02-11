import { ApiProperty } from '@nestjs/swagger';
import {
  CourseLevel,
  CourseCategory,
} from '../../database/entities/course.entity';

export class CourseResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'financial-basics' })
  slug: string;

  @ApiProperty({ example: 'Financial Basics' })
  title: string;

  @ApiProperty({ example: 'Learn the fundamentals of finance' })
  description: string;

  @ApiProperty({ example: 'https://example.com/thumb.jpg' })
  thumbnailUrl: string;

  @ApiProperty({ enum: CourseLevel })
  level: CourseLevel;

  @ApiProperty({ enum: CourseCategory })
  category: CourseCategory;

  @ApiProperty({ example: 'Jan Novak' })
  instructorName: string;

  @ApiProperty({ example: 'Senior financial advisor' })
  instructorBio: string;

  @ApiProperty({ example: 'https://example.com/instructor.jpg' })
  instructorPhoto: string;

  @ApiProperty({ example: 120 })
  duration: number;

  @ApiProperty({ example: 5 })
  moduleCount: number;

  @ApiProperty({ example: 20 })
  lessonCount: number;

  @ApiProperty({ example: 100 })
  enrollmentCount: number;

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: 15 })
  reviewCount: number;

  @ApiProperty({ example: true })
  published: boolean;

  @ApiProperty({ example: false })
  featured: boolean;

  @ApiProperty({ example: 1 })
  position: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
