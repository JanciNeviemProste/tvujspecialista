import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadVideoDto {
  @ApiProperty({
    description: 'The UUID of the lesson this video belongs to',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @IsNotEmpty()
  @IsUUID()
  lessonId: string;

  @ApiProperty({
    description: 'Title of the video',
    example: 'Introduction to TypeScript',
  })
  @IsNotEmpty()
  @IsString()
  title: string;
}
