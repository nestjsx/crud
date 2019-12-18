import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(100)
  domain: string;

  @ApiProperty({ type: 'string' })
  @IsString()
  @MaxLength(100)
  description: string;
}
