import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import Project from '../projects/project.model';
import User from './user.model';

@Table({
  paranoid: false
})
export default class UserProject extends Model<UserProject> {
  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Project)
  @Column
  projectId: number;
}
