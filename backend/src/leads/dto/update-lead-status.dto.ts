import { IsNotEmpty, IsEnum } from 'class-validator';
import { LeadStatus } from '../../database/entities/lead.entity';

export class UpdateLeadStatusDto {
  @IsNotEmpty()
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
