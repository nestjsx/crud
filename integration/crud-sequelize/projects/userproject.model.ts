
import { User } from '../users/user.model';
import { Project } from './project.model';
import { Table, PrimaryKey, Column, DataType, AllowNull, BelongsTo, Model, ForeignKey } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({})
export class UserProject extends Model<UserProject> {
  @Expose()
  @PrimaryKey
  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER
  })
  public projectId: number;

  @Expose()
  @PrimaryKey
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER
  })
  public userId: number;

  @Expose()
  @AllowNull(true)
  @Column({ type: DataType.STRING })
  public review: string;

  @Expose()
  @BelongsTo(() => Project, 'projectId')
  profile: Project;

  @Expose()
  @BelongsTo(() => User, 'userId')
  user: User;
}
