import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongooseCrudService } from '@nestjsx/crud-mongoose';
import { Model } from 'mongoose';
import { PostDocument } from './post.document';

@Injectable()
export class PostsService extends MongooseCrudService<PostDocument> {

  constructor(@InjectModel('Post') model: Model<PostDocument>) {
    super(model);
  }

}
