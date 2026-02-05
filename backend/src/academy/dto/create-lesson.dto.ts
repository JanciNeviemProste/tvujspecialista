import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { LessonType } from '../../database/entities/lesson.entity';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(LessonType)
  type: LessonType;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number; // in minutes

  @IsOptional()
  @IsBoolean()
  free?: boolean;

  @IsOptional()
  content?: any; // for quiz/reading/assignment content
}
