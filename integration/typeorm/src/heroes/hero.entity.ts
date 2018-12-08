import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('heroes')
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
