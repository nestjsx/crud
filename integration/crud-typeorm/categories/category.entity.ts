import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base-entity';
import { Project } from '../projects/project.entity';
import { File } from './file.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => File)
  image: File;

  @OneToMany(() => Project, (el) => el.category)
  projects: Project[];

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];
}
