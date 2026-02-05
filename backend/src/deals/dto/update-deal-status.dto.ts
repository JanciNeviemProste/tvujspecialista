import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DealStatus } from '../../database/entities/deal.entity';

export class UpdateDealStatusDto {
  @ApiProperty({
    description: 'Deal status',
    enum: DealStatus,
    example: DealStatus.CONTACTED,
  })
  @IsNotEmpty()
  @IsEnum(DealStatus)
  status: DealStatus;
}
