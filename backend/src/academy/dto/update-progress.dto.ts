import { IsNotEmpty, IsUUID, IsInt, Min, IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProgressDto {
  @ApiProperty({
    description: 'ID of the enrollment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  enrollmentId: string;

  @ApiProperty({
    description: 'ID of the lesson',
    example: '660e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  lessonId: string;

  @ApiProperty({
    description: 'Total watch time in seconds',
    example: 120,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  watchTimeSeconds: number;

  @ApiProperty({
    description: 'Whether the lesson is completed',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: 'User notes for this lesson',
    example: 'Important concepts to review later',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
