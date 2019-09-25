import { join } from "path";
import { Sequelize } from 'sequelize-typescript';
import { config } from './orm.config';

function sync() {
  const sequelize = new Sequelize(config);
  sequelize.addModels([join(__dirname, './**/*.model.{ts,js}')]);
  return sequelize.sync({ force: true });
}

sync().then(() => process.exit(0));
