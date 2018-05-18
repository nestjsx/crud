import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class MockEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() name: string;
}
