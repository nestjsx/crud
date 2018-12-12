import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNotEmpty } from 'class-validator';

@Entity('heroes')
export class Hero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
