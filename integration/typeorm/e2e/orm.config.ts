import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'root',
  password: 'root',
  database: 'nestjsx_crud_e2e',
  synchronize: false,
  logging: false,
  cache: {
    type: 'redis',
    options: {
      host: '127.0.0.1',
      port: 6379,
    },
  },
  entities: [join(__dirname, './*.entity{.ts,.js}')],
};
