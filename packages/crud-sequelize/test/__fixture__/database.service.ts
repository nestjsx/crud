import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  async closeConnection() {
    return this.sequelize.close();
  }
}
