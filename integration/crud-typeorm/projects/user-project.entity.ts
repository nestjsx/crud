import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { Project } from './project.entity';

@Entity('user_projects')
export class UserProject {
  @PrimaryColumn('int')
  public projectId!: number;

  @PrimaryColumn('int')
  public userId!: number;

  @Column({ nullable: true })
  public review!: string;

  @ManyToOne((type) => Project, (el) => el.userProjects, {
    persistence: false,
    onDelete: 'CASCADE',
  })
  public project: Project;

  @ManyToOne((type) => User, (el) => el.userProjects, {
    persistence: false,
  })
  public user: User;
}
