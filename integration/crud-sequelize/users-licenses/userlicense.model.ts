import { User } from '../users/user.model';
import { License } from './license.model';
import { Table, Model, PrimaryKey, Column, DataType, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Table({})
export class UserLicense extends Model<UserLicense> {
  @Expose()
  @PrimaryKey
  @AllowNull(false)
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER
  })
  userId: number;

  @Expose()
  @PrimaryKey
  @ForeignKey(() => License)
  @Column({ type: DataType.INTEGER })
  licenseId: number;

  @Expose()
  @BelongsTo(() => User)
  user: User;

  @Expose()
  @BelongsTo(() => License)
  license: License;

  @Expose()
  @Column({ type: DataType.INTEGER })
  yearsActive: number;
}
