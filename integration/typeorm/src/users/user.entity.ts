import { Entity, Column, JoinColumn, OneToOne, ManyToOne, ManyToMany, OneToMany } from 'typeorm';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CREATE_UPDATE, CREATE, UPDATE } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { UserProfile } from '../users-profiles/user-profile.entity';
import { Company } from '../companies/company.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

@Entity('users')
export class User extends BaseEntity {
  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(255, { ...CREATE_UPDATE })
  @IsEmail({ require_tld: false }, { ...CREATE_UPDATE })
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsString({ ...CREATE_UPDATE })
  @MaxLength(16, { ...CREATE_UPDATE })
  @Column({ type: 'varchar', length: 16, nullable: false })
  password: string;

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @IsBoolean({ ...CREATE_UPDATE })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profileId: number;

  @Column({ nullable: false })
  companyId: number;

  /**
   * Relations
   */

  @IsOptional({ ...UPDATE })
  @IsNotEmpty({ ...CREATE })
  @ValidateNested({ ...CREATE_UPDATE })
  @Type((t) => UserProfile)
  @OneToOne((type) => UserProfile, (p) => p.user, { cascade: true })
  @JoinColumn()
  profile: UserProfile;

  @ManyToOne((type) => Company, (c) => c.users)
  company: Company;

  @ManyToMany((type) => Project, (c) => c.users)
  projects: Project[];

  @OneToMany((type) => Task, (t) => t.user)
  tasks: Task[];
}
