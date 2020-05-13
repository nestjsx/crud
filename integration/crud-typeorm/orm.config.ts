import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from '@nestjsx/util';

export const withCache: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '127.0.0.1',
  port: 5455,
  username: 'root',
  password: 'root',
  database: 'nestjsx_crud',
  synchronize: false,
  logging: !isNil(process.env.TYPEORM_LOGGING)
    ? !!parseInt(process.env.TYPEORM_LOGGING, 10)
    : true,
  cache: {
    type: 'redis',
    options: {
      host: '127.0.0.1',
      port: 6399,
    },
  },
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
};
