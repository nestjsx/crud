import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "../../../../integration/crud-typeorm/users";
import { TypeOrmCrudService } from "../../../crud-typeorm/src/typeorm-crud.service";

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) repo) {
    super(repo);
  }
}
