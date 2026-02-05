import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WaiveCommissionDto {
  @ApiProperty({
    description: 'Admin note for waiving the commission',
    required: false,
  })
  @IsOptional()
  @IsString()
  note?: string;
}
