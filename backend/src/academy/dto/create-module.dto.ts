import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateModuleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
