import { Document } from 'mongoose';
import { Comment } from './comment.entity';

export interface CommentDocument extends Comment, Document {

}
