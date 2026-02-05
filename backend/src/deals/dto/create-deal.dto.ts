import { IsNotEmpty, IsEmail, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDealDto {
  @ApiProperty({ description: 'ID of the specialist' })
  @IsNotEmpty()
  @IsString()
  specialistId: string;

  @ApiProperty({ description: 'Customer name' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone' })
  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @ApiProperty({ description: 'Customer message' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ description: 'GDPR consent' })
  @IsNotEmpty()
  @IsBoolean()
  gdprConsent: boolean;
}
