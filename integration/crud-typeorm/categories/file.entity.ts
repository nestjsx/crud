import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base-entity';

@Entity("files")
export class File extends BaseEntity {
  @Column()
  path: string;
}
