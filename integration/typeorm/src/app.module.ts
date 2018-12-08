import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HeroesModule } from './heroes/heroes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'nestjsx_crud',
      synchronize: false,
      logging: true,
      cache: {
        type: 'redis',
        options: {
          host: '127.0.0.1',
          port: 6379,
        },
      },
      entities: [join(__dirname, './**/*.entity{.ts,.js}')],
    }),
    HeroesModule,
  ],
})
export class AppModule {}
