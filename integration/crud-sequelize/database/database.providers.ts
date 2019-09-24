import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { config } from '../orm.config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(config);
      sequelize.addModels([join(__dirname, '../**/*.model.{ts,js}')]);
      await sequelize.sync();
      return sequelize;
    }
  }
];
