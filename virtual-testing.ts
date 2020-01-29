// import * as mongoose from 'mongoose';
// import { Model, Schema } from 'mongoose';
// import { postSchema } from './integration/crud-mongoose/posts';
// import { UserDocument } from './integration/crud-mongoose/users/user.document';
// import { userSchema } from './integration/crud-mongoose/users/user.schema';
//
// postSchema.virtual('comments', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'postId',
//   justOne: false,
// });
//
// const commentSchema = new Schema({
//   name: String,
//   postId: String,
// });
//
// const commentModel = mongoose.model('Comment', commentSchema);
// const postModel = mongoose.model('Post', postSchema);
//
// const model: Model<UserDocument> = mongoose.model('User', userSchema);
//
// console.log(mongoose.model('Comment').schema);
// console.log(postModel.schema.virtualpath('comments'));

const populates = [
  { path: '0' },
  { path: '1' },
  { path: '2' },
];

const include = ['name', 'field'];
const excludes  = ['name', 'id'];

console.log(include.filter(field => !excludes.includes(field)).concat(...excludes.map(e => `-${e}`)).join(' ')
);
