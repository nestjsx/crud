import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { Company } from '../companies/company.entity';
import { User } from '../users/user.entity';

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
}
