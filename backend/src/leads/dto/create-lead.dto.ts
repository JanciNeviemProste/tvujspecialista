import { IsNotEmpty, IsEmail, IsString, IsBoolean } from 'class-validator';

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  specialistId: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsBoolean()
  gdprConsent: boolean;
}
