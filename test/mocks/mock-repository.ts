export class MockRepository<T> {
  public entities: T[] = [];

  public async save(entity: any): Promise<any> {
    if (!entity.name) {
      throw new Error();
    }

    if (!entity.id) {
      entity.id = this.entities.length + 1;
    } else {
      this.entities = this.entities.filter((e) => e.id !== entity.id);
    }

    this.entities = [...this.entities, entity];

    return entity;
  }

  public async findOne(id: number): Promise<any> {
    if (!this.entities.length) {
      return null;
    }

    return this.entities.find((entity) => entity.id === id);
  }

  public async find(): Promise<any[]> {
    return this.entities;
  }

  public async delete(id: number): Promise<void> {
    if (!this.entities.find((entity) => entity.id === id)) {
      throw new Error();
    } else {
      this.entities = this.entities.filter((entity) => entity.id !== id);
    }
  }
}
