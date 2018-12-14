import { Entity, Column, OneToOne } from 'typeorm';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { CREATE_UPDATE, CREATE, UPDATE } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { User } from '../users/user.entity';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @IsOptional({ ...CREATE_UPDATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(32, { ...CREATE_UPDATE })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  firstName: string;

  @IsOptional({ ...CREATE_UPDATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(32, { ...CREATE_UPDATE })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  lastName: string;

  /**
   * Relations
   */

  @OneToOne((type) => User, (u) => u.profile)
  user: User;
}
