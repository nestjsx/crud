import { Entity, Column, JoinColumn, OneToOne, ManyToOne, ManyToMany, OneToMany } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { UserProfile } from '../users-profiles/user-profile.entity';
import { Company } from '../companies/company.entity';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 16, nullable: false })
  password: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profileId: number;

  @Column({ nullable: false })
  companyId: number;

  /**
   * Relations
   */

  @OneToOne((type) => UserProfile, (p) => p.user, { cascade: true })
  @JoinColumn()
  profile: UserProfile;

  @ManyToOne((type) => Company, (c) => c.users)
  company: Company;

  @ManyToMany((type) => Project, (c) => c.users)
  projects: Project[];

  @OneToMany((type) => Task, (t) => t.user)
  tasks: Task[];
}
