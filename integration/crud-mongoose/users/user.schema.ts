import { Schema } from 'mongoose';
import { User } from './user.entity';

export const userSchema: Schema = new Schema<User>({
  name: String,
  email: String
}, { timestamps: true });
