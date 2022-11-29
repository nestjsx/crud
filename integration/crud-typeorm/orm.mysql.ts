import { DataSource } from 'typeorm';

exports.default = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',
  port: 3316,
  username: 'nestjsx_crud',
  password: 'nestjsx_crud',
  database: 'nestjsx_crud',
  entities: ['./**/*.entity.ts'],
  migrationsTableName: 'orm_migrations',
  migrations: ['./seeds.ts'],
});
