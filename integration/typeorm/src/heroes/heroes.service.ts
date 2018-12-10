import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryService } from '@nestjsx/crud/typeorm';

import { Hero } from './hero.entity';

@Injectable()
export class HeroesService extends RepositoryService<Hero> {
  constructor(@InjectRepository(Hero) repo) {
    super(repo);
  }
}
