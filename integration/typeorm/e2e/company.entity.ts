import { Entity, Column, OneToMany } from 'typeorm';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from '../../../node_modules/class-validator';
import { CrudValidate } from '../../../src/';

import { BaseEntity } from '../src/base-entity';
import { User } from './user.entity';
import { Project } from './project.entity';
import { Task } from './task.entity';

const { CREATE, UPDATE } = CrudValidate;

@Entity('companies')
export class Company extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(100, { groups: [CREATE, UPDATE] })
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
  users: User[];

  @OneToMany((type) => Project, (p) => p.company)
  projects: Project[];

  @OneToMany((type) => Task, (t) => t.company)
  tasks: Task[];
}
