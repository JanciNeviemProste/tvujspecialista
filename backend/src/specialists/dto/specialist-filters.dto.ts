import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { SpecialistCategory } from '../../database/entities/specialist.entity';

export class SpecialistFiltersDto {
  @IsOptional()
  @IsEnum(SpecialistCategory)
  category?: SpecialistCategory;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minRating?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  verified?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

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
