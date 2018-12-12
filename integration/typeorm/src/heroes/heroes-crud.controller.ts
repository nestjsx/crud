import { Controller, Body } from '@nestjs/common';
import { Crud, CrudController, RestfulOptions } from '@nestjsx/crud';

import { Hero } from './hero.entity';
import { HeroesService } from './heroes.service';

@Crud(Hero)
@Controller('heroes')
export class HeroesCrudController implements CrudController<HeroesService, Hero> {
  paramsFilter = [];
  options: RestfulOptions = {};

  constructor(public service: HeroesService) {}
}
