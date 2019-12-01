import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCrudService } from '@nestjsx/crud-mongoose/mongoose-crud.service';
import { UserDocument } from '../../../../integration/crud-mongoose/users/user.document';

@Injectable()
export class UsersService extends MongooseCrudService<UserDocument> {
  constructor(@InjectModel('User') public repo) {
    super(repo);
  }
}
