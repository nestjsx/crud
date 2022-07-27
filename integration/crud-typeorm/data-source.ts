import { join } from 'path';
import { isNil } from '@vianneybr/nestjsx-util';
import { DataSource } from 'typeorm';

const type = (process.env.TYPEORM_CONNECTION as any) || 'postgres';
export const AppDataSource = new DataSource({
  type: type,
  host: '127.0.0.1',
  port: type === 'postgres' ? 5455 : 3316,
  username: type === 'mysql' ? 'nestjsx_crud' : 'root',
  password: type === 'mysql' ? 'nestjsx_crud' : 'root',
  database: 'nestjsx_crud',
  synchronize: false,
  logging: !isNil(process.env.TYPEORM_LOGGING) ? !!parseInt(process.env.TYPEORM_LOGGING, 10) : true,
  entities: [join(__dirname, './**/*.entity{.ts,.js}')],
});
