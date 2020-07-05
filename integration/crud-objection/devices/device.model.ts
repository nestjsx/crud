import { IsOptional, IsString, IsUUID } from 'class-validator';
import { Model } from 'objection';

export class Device extends Model {
  static readonly tableName = 'devices';

  static get idColumn() {
    return ['deviceKey'];
  }

  @IsOptional({ always: true })
  @IsUUID('4', { always: true })
  deviceKey: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  description?: string;
}
