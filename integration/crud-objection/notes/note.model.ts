import { Model } from 'objection';

export class Note extends Model {
  static readonly tableName = 'notes';

  readonly id: number;
  revisionId: number;
}
