import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TypeOrmCrudService } from '../../../crud-typeorm/src/typeorm-crud.service';
import { UserLicense } from '../../../../integration/crud-typeorm/users-licenses';

@Injectable()
export class UserLicenseService extends TypeOrmCrudService<UserLicense> {
  constructor(@InjectRepository(UserLicense) repo) {
    super(repo);
  }
}
