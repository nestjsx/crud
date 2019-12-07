import { Schema } from 'mongoose';
import { User } from './user.entity';

export const userSchema: Schema = new Schema<User>({
  name: String,
  email: String,
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId',
  justOne: false,
});
