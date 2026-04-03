import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestReviewTokenDto {
  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;
}
