import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JoinParamDto {
  @IsNotEmpty()
  @IsString()
  field: string;

  @IsOptional()
  @IsString({ each: true })
  select?: string[];
}
