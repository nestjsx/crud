import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
} from '../../../node_modules/class-validator';
import { Type } from '../../../node_modules/class-transformer';
import { CrudValidate } from '../../../src/';

import { BaseEntity } from '../src//base-entity';
import { UserProfile } from './user-profile.entity';
import { Company } from './company.entity';

const { UPDATE, CREATE } = CrudValidate;

@Entity('users')
export class User extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(255, { always: true })
  @IsEmail({ require_tld: false }, { always: true })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(16, { always: true })
  @Column({ type: 'varchar', length: 16, nullable: false })
  password: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profileId: number;

  @Column({ nullable: false })
  companyId: number;

  /**
   * Relations
   */

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ValidateNested({ always: true })
  @Type((t) => UserProfile)
  @OneToOne((type) => UserProfile, (p) => p.user, { cascade: true })
  @JoinColumn()
  profile: UserProfile;

  @ManyToOne((type) => Company, (c) => c.users)
  company: Company;
}
