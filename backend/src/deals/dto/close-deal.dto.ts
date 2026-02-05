import { IsNotEmpty, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DealStatus } from '../../database/entities/deal.entity';

export class CloseDealDto {
  @ApiProperty({
    description: 'Deal closing status',
    enum: [DealStatus.CLOSED_WON, DealStatus.CLOSED_LOST],
    example: DealStatus.CLOSED_WON,
  })
  @IsNotEmpty()
  @IsEnum(DealStatus)
  status: DealStatus.CLOSED_WON | DealStatus.CLOSED_LOST;

  @ApiProperty({
    description: 'Actual deal value (required for closed won)',
    example: 50000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  actualDealValue?: number;
}
