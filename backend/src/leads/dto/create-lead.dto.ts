import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  website?: string; // honeypot — bots fill this, humans leave it empty

  @IsNotEmpty()
  @IsString()
  specialistId: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  customerName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  customerEmail: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  customerPhone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  @IsNotEmpty()
  @IsBoolean()
  gdprConsent: boolean;
}
