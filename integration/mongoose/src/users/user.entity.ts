import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { CREATE_UPDATE, CREATE, UPDATE } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { Column } from './../../../../src/mongoose/decorators/Column';

export class User extends BaseEntity {
  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(255, { ...CREATE_UPDATE })
  @IsEmail({ require_tld: false }, { ...CREATE_UPDATE })
  @Column()
  email: string;

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(16, { ...CREATE_UPDATE })
  @Column()
  password: string;

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsBoolean({ ...CREATE_UPDATE })
  @Column()
  isActive: boolean;

  @Column()
  profileId: number;

  @Column()
  companyId: number;
}
export const UserScheme = new mongoose.Schema({
  email: String,
  password: String,
  isActive: Boolean,
  profileId: Number,
  companyId: Number,
});