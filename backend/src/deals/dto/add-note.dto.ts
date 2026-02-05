import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddNoteDto {
  @ApiProperty({ description: 'Note to add to the deal' })
  @IsNotEmpty()
  @IsString()
  note: string;
}
