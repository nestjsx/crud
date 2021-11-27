import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
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
import { CrudValidationGroups } from '@rewiko/crud';

import { BaseEntity } from '../base-entity';
import { UserProfile } from '../users-profiles/user-profile.entity';
import { UserLicense } from '../users-licenses/user-license.entity';
import { Company } from '../companies/company.entity';
import { Project } from '../projects/project.entity';
import { UserProject } from '../projects/user-project.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

export class Name {
  @IsString({ always: true })
  @Column({ nullable: true })
  first: string;

  @IsString({ always: true })
  @Column({ nullable: true })
  last: string;
}

// tslint:disable-next-line:max-classes-per-file
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
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Type((t) => Name)
  @Column((type) => Name)
  name: Name;

  @Column({ nullable: true })
  profileId?: number;

  @Column({ nullable: false })
  companyId?: number;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  /**
   * Relations
   */

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @ValidateNested({ always: true })
  @Type((t) => UserProfile)
  @OneToOne((type) => UserProfile, (p) => p.user, { cascade: true })
  @JoinColumn()
  profile?: UserProfile;

  @ManyToOne((type) => Company, (c) => c.users)
  company?: Company;

  @ManyToMany((type) => Project, (c) => c.users)
  projects?: Project[];

  @OneToMany((type) => UserProject, (el) => el.user, {
    persistence: false,
    onDelete: 'CASCADE',
  })
  userProjects?: UserProject[];

  @OneToMany((type) => UserLicense, (ul) => ul.user)
  @Type((t) => UserLicense)
  @JoinColumn()
  userLicenses?: UserLicense[];
}
