import { Schema } from 'mongoose';
import { CommentDocument } from './comment.document';

export const commentSchema: Schema = new Schema<CommentDocument>({
  title: String,
  userId: String,
  postId: String,
}, { timestamps: true });
