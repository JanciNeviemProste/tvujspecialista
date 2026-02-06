import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsArray,
  IsUrl,
} from 'class-validator';

export class UpdateSpecialistDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availability?: string[];
}
