import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import {
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  IsDefined,
  IsBoolean,
} from 'class-validator';
import { CrudValidationGroups } from '@rewiko/crud';

import { BaseEntity } from '../base-entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';
import { UserProject } from './user-project.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('projects')
export class Project extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsDefined({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name?: string;

  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @IsOptional({ always: true })
  @IsBoolean({ always: true })
  @Column({ type: 'boolean', default: true })
  isActive?: boolean;

  @IsOptional({ always: true })
  @IsNumber({}, { always: true })
  @Column({ nullable: false })
  companyId?: number;

  /**
   * Relations
   */

  @ManyToOne((type) => Company, (c) => c.projects)
  company?: Company;

  @ManyToMany((type) => User, (u) => u.projects, { cascade: true })
  @JoinTable({
    name: 'user_projects',
    joinColumn: {
      name: 'projectId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users?: User[];

  @OneToMany((type) => UserProject, (el) => el.project, {
    persistence: false,
    onDelete: 'CASCADE',
  })
  userProjects!: UserProject[];
}
