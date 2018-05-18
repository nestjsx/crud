import { Controller } from '@nestjs/common';
import { CrudController } from '../../src/crud.controller';
import { MockEntity } from './mock-entity';
import { MockService } from './mock-service';

@Controller('mock')
export class MockController extends CrudController<MockEntity> {
  constructor(private readonly mockService: MockService) {
    super(mockService);
  }
}
