import { Exclude } from 'class-transformer';

import { TestSerializeModel } from './test-serialize.model';

export class TestSerialize2Model extends TestSerializeModel {
  id: number;
  name: string;
  email: string;

  @Exclude()
  isActive: boolean;

  constructor(partial: Partial<TestSerialize2Model>) {
    super(partial);
    Object.assign(this, partial);
  }
}
