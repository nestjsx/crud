import { CrudValidationGroups } from '@nestjsx/crud';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('companies')
export class Company extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(100, { groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  domain: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true, default: null })
  description: string;

  /**
   * Relations
   */

  @OneToMany((type) => User, (u) => u.company)
  @Type((t) => User)
  users: User[];

  @OneToMany((type) => Project, (p) => p.company)
  projects: Project[];
}
