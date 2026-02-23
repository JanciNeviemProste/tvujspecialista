import { IsNotEmpty, IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  @IsUUID()
  categoryId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;
}
