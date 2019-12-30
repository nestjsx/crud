import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@Entity('licenses')
export class License extends BaseEntity {
  @IsOptional({ always: true })
  @IsString({ always: true })
  @MaxLength(32, { always: true })
  @Column({ type: 'varchar', length: 32, nullable: true, default: null })
  name: string;
}
