import { Document } from 'mongoose';
import { User } from './user.entity';

export interface UserDocument extends User, Document {

}
