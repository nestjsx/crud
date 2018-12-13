import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  domain: string;

  @Column({ type: 'text', nullable: true })
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
