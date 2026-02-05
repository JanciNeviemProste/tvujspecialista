import { IsOptional, IsEnum, IsString, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { SpecialistCategory } from '../../database/entities/specialist.entity';

export class SpecialistFiltersDto {
  @IsOptional()
  @IsEnum(SpecialistCategory)
  category?: SpecialistCategory;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

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
