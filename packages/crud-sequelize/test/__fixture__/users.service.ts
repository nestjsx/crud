import { Inject, Injectable } from "@nestjs/common";

import User from "../../../../integration/crud-sequelize/users/user.model";
import { SequelizeCrudService } from "../../src";

@Injectable()
export class UsersService extends SequelizeCrudService<User> {
  constructor(
    @Inject("UsersRepository")
    private readonly repo: User & typeof User
  ) {
    super(repo);
  }
}
