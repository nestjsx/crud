import * as Knex from 'knex';
import { Model } from 'objection';
import { Name, User } from '../users';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  const name: Name = { first: null, last: null };
  const name1: Name = { first: 'firstname1', last: 'lastname1' };

  await User.query().insert([
    { email: '1@email.com', isActive: true, companyId: 1, profileId: 1, name: name1 },
    { email: '2@email.com', isActive: true, companyId: 1, profileId: 2, name },
    { email: '3@email.com', isActive: true, companyId: 1, profileId: 3, name },
    { email: '4@email.com', isActive: true, companyId: 1, profileId: 4, name },
    { email: '5@email.com', isActive: true, companyId: 1, profileId: 5, name },
    { email: '6@email.com', isActive: true, companyId: 1, profileId: 6, name },
    { email: '7@email.com', isActive: false, companyId: 1, profileId: 7, name },
    { email: '8@email.com', isActive: false, companyId: 1, profileId: 8, name },
    { email: '9@email.com', isActive: false, companyId: 1, profileId: 9, name },
    { email: '10@email.com', isActive: true, companyId: 1, profileId: 10, name },
    { email: '11@email.com', isActive: true, companyId: 2, profileId: 11, name },
    { email: '12@email.com', isActive: true, companyId: 2, profileId: 12, name },
    { email: '13@email.com', isActive: true, companyId: 2, profileId: 13, name },
    { email: '14@email.com', isActive: true, companyId: 2, profileId: 14, name },
    { email: '15@email.com', isActive: true, companyId: 2, profileId: 15, name },
    { email: '16@email.com', isActive: true, companyId: 2, profileId: 16, name },
    { email: '17@email.com', isActive: false, companyId: 2, profileId: 17, name },
    { email: '18@email.com', isActive: false, companyId: 2, profileId: 18, name },
    { email: '19@email.com', isActive: false, companyId: 2, profileId: 19, name },
    { email: '20@email.com', isActive: false, companyId: 2, profileId: 20, name },
    { email: '21@email.com', isActive: false, companyId: 2, profileId: null, name },
  ]);
}
