import { Exclude, Transform } from 'class-transformer';

import { TestSerializeModel } from './test-serialize.model';

export class TestSerializeTransformModel extends TestSerializeModel {
  id: number;

  @Transform((value, obj) => obj.id + ':' + obj.name)
  name: string;

  email: string;

  @Exclude()
  isActive: boolean;

  constructor(partial: Partial<TestSerializeTransformModel>) {
    super(partial);
    Object.assign(this, partial);
  }
}
