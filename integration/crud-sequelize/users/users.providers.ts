import User from './user.model';

export const usersProviders = [{ provide: 'UsersRepository', useValue: User }];
