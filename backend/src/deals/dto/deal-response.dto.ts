import { ApiProperty } from '@nestjs/swagger';
import { DealStatus } from '../../database/entities/deal.entity';

export class DealResponseDto {
  @ApiProperty({ example: 'uuid-123' })
  id: string;

  @ApiProperty({ example: 'specialist-uuid-123' })
  specialistId: string;

  @ApiProperty({ example: 'Jane Customer' })
  customerName: string;

  @ApiProperty({ example: 'jane@example.com' })
  customerEmail: string;

  @ApiProperty({ example: '+420987654321' })
  customerPhone: string;

  @ApiProperty({ example: 'I need financial advice' })
  message: string;

  @ApiProperty({ enum: DealStatus })
  status: DealStatus;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        content: { type: 'string' },
        createdAt: { type: 'string' },
        author: {
          type: 'object',
          properties: { name: { type: 'string' } },
        },
      },
    },
    example: [{ id: 'uuid', content: 'Initial contact made', createdAt: '2026-01-01T00:00:00Z', author: { name: 'John' } }],
  })
  notes: Array<{ id: string; content: string; createdAt: string; author: { name: string } }>;

  @ApiProperty({ example: true })
  gdprConsent: boolean;

  @ApiProperty({ example: 100000, nullable: true })
  dealValue: number;

  @ApiProperty({ example: '2026-06-01', nullable: true })
  estimatedCloseDate: Date;

  @ApiProperty({ example: null, nullable: true })
  actualCloseDate: Date;

  @ApiProperty({ example: null, nullable: true })
  commissionId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
