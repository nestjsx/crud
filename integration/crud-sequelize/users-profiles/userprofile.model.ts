import { BaseEntity } from '../base-entity';
import { User } from '../users/user.model';
import { Table, DataType, Column, HasOne } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({})
export class UserProfile extends BaseEntity {
  @Expose()
  @Column({ type: DataType.STRING(32), defaultValue: null })
  name: string;

  /**
   * Relations
   */
  @Expose()
  @HasOne(() => User)
  user: User;
}
