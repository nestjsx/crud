import { Schema } from 'mongoose';
import { Post } from './post.entity';

export const postSchema: Schema = new Schema<Post>({
  id: String,
  title: String,
  userId: String,
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  justOne: false,
});
