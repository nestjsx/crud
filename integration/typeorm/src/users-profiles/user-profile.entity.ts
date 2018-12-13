import { Entity, Column, OneToOne } from 'typeorm';

import { BaseEntity } from '../base-entity';
import { User } from '../users/user.entity';

@Entity('user_profiles')
export class UserProfile extends BaseEntity {
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  firstName: string;

  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  lastName: string;

  /**
   * Relations
   */

  @OneToOne((type) => User, (u) => u.profile)
  user: User;
}
