import { IsNotEmpty, IsEmail, IsString, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDealDto {
  @ApiProperty({ description: 'ID of the specialist' })
  @IsNotEmpty()
  @IsString()
  specialistId: string;

  @ApiProperty({ description: 'Customer name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(320)
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  customerPhone: string;

  @ApiProperty({ description: 'Customer message' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  message: string;

  @ApiProperty({ description: 'GDPR consent' })
  @IsNotEmpty()
  @IsBoolean()
  gdprConsent: boolean;
}
