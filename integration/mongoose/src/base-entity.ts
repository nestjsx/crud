import { Column } from '../../../src/mongoose/decorators/Column';

export class BaseEntity {
  @Column()
  id: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
