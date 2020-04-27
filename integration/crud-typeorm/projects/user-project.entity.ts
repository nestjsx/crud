import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../users/user.entity';
import { Project } from './project.entity';

@Entity('user_projects')
export class UserProject {
  @PrimaryColumn()
  public projectId!: number;

  @PrimaryColumn()
  public userId!: number;

  @Column({ nullable: true })
  public review!: string;

  @ManyToOne((type) => Project, (el) => el.userProjects, {
    primary: true,
    persistence: false,
    onDelete: 'CASCADE',
  })
  public project: Project;

  @ManyToOne((type) => User, (el) => el.userProjects, {
    primary: true,
    persistence: false,
  })
  public user: User;
}
