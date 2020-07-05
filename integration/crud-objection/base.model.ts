import { Model } from 'objection';

export class BaseModel extends Model {
  readonly id: number;

  createdAt: Date;
  updatedAt: Date;

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  $beforeInsert() {
    this.createdAt = new Date();
  }
}
