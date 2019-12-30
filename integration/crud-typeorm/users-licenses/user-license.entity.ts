import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Type } from 'class-transformer';
import { License } from './license.entity';

@Entity('user_licenses')
export class UserLicense {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  licenseId: number;

  @ManyToOne((type) => User)
  @Type((t) => User)
  user: User;

  @ManyToOne((type) => License)
  @Type((t) => License)
  license: License;

  @Column()
  yearsActive: number;
}
