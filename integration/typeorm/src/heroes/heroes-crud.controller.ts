import { Controller, Get } from '@nestjs/common';
import { CrudController, Inherit } from '@nestjsx/crud';

import { Hero } from './hero.entity';
import { HeroesService } from './heroes.service';

@Inherit()
@Controller('heroes')
export class HeroesCrudController extends CrudController<HeroesService, Hero> {
  constructor(service: HeroesService) {
    super(service);
  }

  @Get('test')
  async test() {
    return this.service.test();
  }
}
