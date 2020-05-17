import { CrudValidationGroups } from '@nestjsx/crud';
import { IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../base-entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export enum ETitle {
  CEO = 'ceo',
  CTO = 'cto',
  COO = 'coo',
  CFO = 'cfo'
}

export class User extends BaseEntity {

  @IsString({ groups: [CREATE, UPDATE] })
  @IsOptional({ groups: [CREATE, UPDATE] })
  name?: string;

  @IsString({ groups: [CREATE, UPDATE] })
  @IsOptional({ groups: [CREATE, UPDATE] })
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  title?: ETitle;

  @IsString()
  @IsOptional()
  age?: number;
}
