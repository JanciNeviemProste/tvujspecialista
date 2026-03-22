import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class PublishDto {
  @IsBoolean()
  published: boolean;
}

export class VerifySpecialistDto {
  @IsBoolean()
  verified: boolean;
}

export class UpdateStatusDto {
  @IsString()
  status: string;
}

export class AdminNoteDto {
  @IsString()
  note: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
