import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
  ArrayContains,
  ArrayNotEmpty,
  ArrayMinSize,
  IsInt,
  IsArray,
} from 'class-validator';
import * as mongoose from 'mongoose';
import { CREATE_UPDATE, CREATE, UPDATE } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { Column } from './../../../../src/mongoose/decorators/Column';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

export class User extends BaseEntity {
  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(255, { ...CREATE_UPDATE })
  @IsEmail({ require_tld: false }, { ...CREATE_UPDATE })
  @ApiModelProperty()
  @Column()
  email: string;

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(16, { ...CREATE_UPDATE })
  @Column()
  @ApiModelProperty()
  password: string;

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsBoolean({ ...CREATE_UPDATE })
  @Column()
  @ApiModelProperty()
  isActive: boolean;

  @ValidateNested()
  @Type(() => Friend)
  @IsArray()
  @ApiModelProperty()
  @Column()
  friends: Array<Friend>;
}
export class Friend {
  @IsInt()
  @IsNotEmpty()
  @ApiModelProperty()
  name: number;
  @IsNotEmpty()
  @ApiModelProperty()
  description: string;
}
export const UserScheme = new mongoose.Schema({
  email: String,
  password: String,
  isActive: Boolean,
  friends: Array,
  profileId: Number,
  companyId: Number,
});