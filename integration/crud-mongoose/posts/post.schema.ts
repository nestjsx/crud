import { Schema } from 'mongoose';
import { Post } from './post.entity';

export const postSchema: Schema = new Schema<Post>({
  id: String,
  title: String,
  userId: String,
}, {
  timestamps: true,
});
