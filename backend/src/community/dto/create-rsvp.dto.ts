import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRSVPDto {
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
