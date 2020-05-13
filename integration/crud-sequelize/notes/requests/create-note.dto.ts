import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  revisionId: string;
}
