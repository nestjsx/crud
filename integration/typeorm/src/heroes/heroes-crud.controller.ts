import { Controller } from '@nestjs/common';
import { CrudController, Inherit } from '../../../../src';

import { Hero } from './hero.entity';
import { HeroesService } from './heroes.service';

@Inherit()
@Controller('heroes')
export class HeroesCrudController extends CrudController<Hero> {
  constructor(service: HeroesService) {
    super(service);
  }
}
