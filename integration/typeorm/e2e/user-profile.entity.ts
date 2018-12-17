import { Entity, Column, OneToOne } from 'typeorm';
import { IsOptional, IsString, MaxLength } from '../../../node_modules/class-validator';

import { BaseEntity } from '../src/base-entity';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  firstName: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  lastName: string;

  /**
   * Relations
   */

  @OneToOne((type) => User, (u) => u.profile)
  user: User;
}
