import { join } from "path";
import { Sequelize } from 'sequelize-typescript';
import { config } from './sequelize.config';

function sync() {
  const sequelize = new Sequelize(config);
  return sequelize.sync({ force: true });
}

sync().then(() => process.exit(0));
