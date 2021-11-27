import { CrudValidationGroups } from '@rewiko/crud';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  IsEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BaseEntity } from '../base-entity';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('companies')
export class Company extends BaseEntity {
  @IsOptional({ groups: [UPDATE] })
  @IsEmpty({ groups: [CREATE] })
  @IsNumber({}, { groups: [UPDATE] })
  @PrimaryGeneratedColumn()
  id?: number;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @IsString({ groups: [CREATE, UPDATE] })
  @MaxLength(100, { groups: [CREATE, UPDATE] })
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  domain: string;

  @IsOptional({ always: true })
  @IsString({ always: true })
  @Column({ type: 'text', nullable: true, default: null })
  description: string;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  /**
   * Relations
   */

  @OneToMany((type) => User, (u) => u.company)
  @Type((t) => User)
  users: User[];

  @OneToMany((type) => Project, (p) => p.company)
  projects: Project[];
}
