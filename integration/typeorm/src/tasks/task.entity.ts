import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Company } from '../companies/company.entity';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';

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
