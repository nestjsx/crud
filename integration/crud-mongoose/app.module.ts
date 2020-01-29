import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_CONFIG, MONGO_URI } from './mongoose.config';
import { postSchema } from './posts';
import { PostsModule } from './posts/posts.module';
import { userSchema } from './users/user.schema';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI, MONGO_CONFIG),
    MongooseModule.forFeature([
      { name: 'User', schema: userSchema },
      { name: 'Post', schema: postSchema },
    ]),
    UsersModule,
    PostsModule
  ],
  providers: [],
})
export class AppModule {
}
