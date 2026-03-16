import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CrmProvider } from '../../database/entities/specialist.entity';

export class UpdateSpecialistCrmDto {
  @ApiProperty({ enum: CrmProvider, example: CrmProvider.OVB })
  @IsEnum(CrmProvider)
  crmProvider: CrmProvider;

  @ApiProperty({ example: 'TIPSTER-12345', required: false })
  @IsOptional()
  @IsString()
  crmTipsterAccount?: string;
}
