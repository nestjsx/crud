import { IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseModel } from '../base.model';

export class License extends BaseModel {
  static readonly tableName = 'licenses';

  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  name: string;
}
