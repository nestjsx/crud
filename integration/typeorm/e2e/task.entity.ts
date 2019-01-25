/*
 * Copyright under the Parsec Tech Co., Ltd. Version 1.0;
 * you may not use this file except in compliance with the permit.
 * Copyright (c) 2019 ChongQing Parsec Technology Corporation. All Rights Reserved.
 * Version 1.0
 */

import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../src/base-entity';
import { Company } from './company.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  status: string;

  @Column({ nullable: false })
  companyId: number;

  @Column({ nullable: false })
  projectId: number;

  @Column({ nullable: false })
  userId: number;

  /**
   * Relations
   */

  @ManyToOne((type) => Company, (c) => c.tasks)
  company: Company;

  @ManyToOne((type) => Project, (c) => c.tasks)
  project: Project;

  @ManyToOne((type) => User, (u) => u.tasks)
  user: User;
}
