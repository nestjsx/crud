/*
 * Copyright under the Parsec Tech Co., Ltd. Version 1.0;
 * you may not use this file except in compliance with the permit.
 * Copyright (c) 2019 ChongQing Parsec Technology Corporation. All Rights Reserved.
 * Version 1.0
 */

import { Entity, Column, ManyToOne, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from '../src/base-entity';
import { Company } from './company.entity';
import { User } from './user.entity';
import { Task } from './task.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: false })
  companyId: number;

  /**
   * Relations
   */

  @ManyToOne((type) => Company, (c) => c.projects)
  company: Company;

  @ManyToMany((type) => User, (u) => u.projects, { cascade: true })
  @JoinTable()
  users: User[];

  @OneToMany((type) => Task, (t) => t.project)
  tasks: Task[];
}
