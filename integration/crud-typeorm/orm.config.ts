import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const withCache: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  // port: 5455,
  username: 'nest_user',
  password: 'password',
  database: 'nestjsx_crud',
  synchronize: false,
  logging: false,
  // cache: {
  //   type: 'redis',
  //   options: {
  //     host: '127.0.0.1',
  //     port: 6399,
  //   },
  // },
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
};
