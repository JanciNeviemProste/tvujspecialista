import { IsString, IsOptional } from 'class-validator';

export class CreateRSVPDto {
  @IsOptional()
  @IsString()
  notes?: string;
}
