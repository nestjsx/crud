import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Hero } from './hero.entity';
import { HeroesService } from './heroes.service';
import { HeroesCrudController } from './heroes-crud.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Hero])],
  providers: [HeroesService],
  exports: [HeroesService],
  controllers: [HeroesCrudController],
})
export class HeroesModule {}
