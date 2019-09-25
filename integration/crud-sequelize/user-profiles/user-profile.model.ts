import { Column, HasOne, Model, Table } from 'sequelize-typescript';
import User from '../users/user.model';

@Table({})
export default class UserProfile extends Model<UserProfile> {
  @Column
  name: string;

  @HasOne(() => User, 'profileId')
  user: User;
}
