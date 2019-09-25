import { SequelizeOptions } from 'sequelize-typescript';

export const config: SequelizeOptions = {
  dialect: 'postgres',
  host: '127.0.0.1',
  port: 5456,
  username: 'root',
  password: 'root',
  database: 'nestjsx_crud_sequelize',
  logging: false,
  define: {
    underscored: true,
    paranoid: false,
    timestamps: true,
    freezeTableName: false
  }
};
