import { Entity, Column, OneToMany } from 'typeorm';
import { IsOptional, IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { CREATE_UPDATE, CrudValidate } from '@nestjsx/crud';

import { BaseEntity } from '../base-entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

const { CREATE, UPDATE } = CrudValidate;

@Entity('companies')
export class Company extends BaseEntity {
  @IsOptional({ groups: [UPDATE] }) // using as an array of strings
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ ...CREATE_UPDATE }) // using as a destructured '{ groups: [CREATE, UPDATE] }'
  @MaxLength(100, { always: true }) // using as 'always: true'
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
