import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddNoteDto {
  @ApiProperty({ description: 'Note to add to the deal' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(5000)
  note: string;
}
