import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetNoteResponseDto {
  @ApiProperty({ type: 'number' })
  @IsNumber()
  id: string;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  revisionId: string;
}
