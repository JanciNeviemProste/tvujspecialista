import { ApiProperty } from '@nestjs/swagger';
import {
  SpecialistCategory,
  SubscriptionTier,
} from '../../database/entities/specialist.entity';

export class SpecialistResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'user-uuid-123' })
  userId: string;

  @ApiProperty({ example: 'jan-novak' })
  slug: string;

  @ApiProperty({ example: 'Jan Novak' })
  name: string;

  @ApiProperty({ example: 'jan@example.com' })
  email: string;

  @ApiProperty({ example: '+420123456789' })
  phone: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  photo: string;

  @ApiProperty({ example: false })
  verified: boolean;

  @ApiProperty({ example: false })
  topSpecialist: boolean;

  @ApiProperty({ enum: SpecialistCategory })
  category: SpecialistCategory;

  @ApiProperty({ example: 'Praha' })
  location: string;

  @ApiProperty({ example: 'Experienced financial advisor' })
  bio: string;

  @ApiProperty({ example: 10 })
  yearsExperience: number;

  @ApiProperty({ example: 500 })
  hourlyRate: number;

  @ApiProperty({ example: 4.5 })
  rating: number;

  @ApiProperty({ example: 12 })
  reviewsCount: number;

  @ApiProperty({ type: [String], example: ['Investments', 'Insurance'] })
  services: string[];

  @ApiProperty({ type: [String], example: ['CFA', 'CFP'] })
  certifications: string[];

  @ApiProperty({ example: 'Charles University' })
  education: string;

  @ApiProperty({ example: 'https://example.com', nullable: true })
  website: string;

  @ApiProperty({ example: 'https://linkedin.com/in/jan', nullable: true })
  linkedin: string;

  @ApiProperty({ example: null, nullable: true })
  facebook: string;

  @ApiProperty({ example: null, nullable: true })
  instagram: string;

  @ApiProperty({ example: 5 })
  leadCount: number;

  @ApiProperty({ type: [String], example: ['Monday', 'Wednesday'] })
  availability: string[];

  @ApiProperty({ enum: SubscriptionTier })
  subscriptionTier: SubscriptionTier;

  @ApiProperty({ example: 3 })
  leadsThisMonth: number;

  @ApiProperty({ example: '2026-12-31T00:00:00.000Z', nullable: true })
  subscriptionExpiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
