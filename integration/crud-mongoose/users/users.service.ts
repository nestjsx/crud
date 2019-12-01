import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCrudService } from '@nestjsx/crud-mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './user.document';

@Injectable()
export class UsersService extends MongooseCrudService<UserDocument> {

  constructor(@InjectModel('User') model: Model<UserDocument>) {
    super(model);
  }

}
