import { ApiProperty } from '@nestjs/swagger';
import { CommissionStatus } from '../../database/entities/commission.entity';

export class CommissionResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'deal-uuid-123' })
  dealId: string;

  @ApiProperty({ example: 'specialist-uuid-123' })
  specialistId: string;

  @ApiProperty({ example: 100000 })
  dealValue: number;

  @ApiProperty({ example: 0.15 })
  commissionRate: number;

  @ApiProperty({ example: 15000 })
  commissionAmount: number;

  @ApiProperty({ enum: CommissionStatus })
  status: CommissionStatus;

  @ApiProperty()
  calculatedAt: Date;

  @ApiProperty()
  dueDate: Date;

  @ApiProperty({ nullable: true })
  invoicedAt: Date;

  @ApiProperty({ nullable: true })
  paidAt: Date;

  @ApiProperty({ example: 'pi_123', nullable: true })
  stripePaymentIntentId: string;

  @ApiProperty({ example: 'Admin note', nullable: true })
  notes: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
