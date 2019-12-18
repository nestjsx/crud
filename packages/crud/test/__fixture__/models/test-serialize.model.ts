export class TestSerializeModel {
  id: number;
  name: string;
  email: string;
  isActive: boolean;

  constructor(partial: Partial<TestSerializeModel>) {
    Object.assign(this, partial);
  }
}
