import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CrudValidationGroups } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { UserProfile } from '../users-profiles/user-profile.entity';
import { Company } from '../companies/company.entity';
import { Project } from '../projects/project.entity';
import { UserLicense } from '../users-licenses/user-license.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

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

  @Column({ nullable: true })
  profileId?: number;

  @Column({ nullable: false })
  companyId?: number;

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

  @OneToMany((type) => UserLicense, (ul) => ul.user)
  @Type((t) => UserLicense)
  @JoinColumn()
  userLicenses?: UserLicense[];
}
