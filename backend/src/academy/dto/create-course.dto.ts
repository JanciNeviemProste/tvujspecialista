import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsUrl,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import {
  CourseLevel,
  CourseCategory,
} from '../../database/entities/course.entity';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsNotEmpty()
  @IsEnum(CourseCategory)
  category: CourseCategory;

  @IsNotEmpty()
  @IsString()
  instructorName: string;

  @IsNotEmpty()
  @IsString()
  instructorBio: string;

  @IsNotEmpty()
  @IsUrl()
  instructorPhoto: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
