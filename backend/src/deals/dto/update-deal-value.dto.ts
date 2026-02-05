import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDealValueDto {
  @ApiProperty({
    description: 'Deal value in CZK',
    example: 50000,
  })
  @IsNotEmpty()
  @IsNumber()
  dealValue: number;

  @ApiProperty({
    description: 'Estimated close date',
    example: '2026-03-01',
  })
  @IsNotEmpty()
  @IsDateString()
  estimatedCloseDate: Date;
}
