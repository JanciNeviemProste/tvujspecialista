import {
  IsOptional,
  IsString,
  IsArray,
  IsUrl,
  IsBoolean,
  MinLength,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class MediaGalleryItemDto {
  @IsString()
  @IsIn(['image', 'video'])
  type: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

export class UpdateSpecialistDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(9)
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

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
  @IsUrl({}, { message: 'Invalid URL' })
  facebook?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL' })
  instagram?: string;

  @IsOptional()
  @IsBoolean()
  onboardingCompleted?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availability?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  regions?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaGalleryItemDto)
  mediaGallery?: MediaGalleryItemDto[];
}
