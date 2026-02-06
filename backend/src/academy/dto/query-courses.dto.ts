import { IsOptional, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  CourseLevel,
  CourseCategory,
} from '../../database/entities/course.entity';

export class QueryCoursesDto {
  @IsOptional()
  @IsEnum(CourseCategory)
  category?: CourseCategory;

  @IsOptional()
  @IsEnum(CourseLevel)
  level?: CourseLevel;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number = 12;
}
