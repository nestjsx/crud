import { Document } from 'mongoose';
import { Post } from './post.entity';

export interface PostDocument extends Post, Document {

}
