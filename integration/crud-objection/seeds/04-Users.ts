import * as Knex from 'knex';
import { Model } from 'objection';
import { User } from '../users';

export async function seed(knex: Knex): Promise<any> {
  Model.knex(knex);

  await User.query().insert([
    { email: '1@email.com', isActive: true, companyId: 1, profileId: 1 },
    { email: '2@email.com', isActive: true, companyId: 1, profileId: 2 },
    { email: '3@email.com', isActive: true, companyId: 1, profileId: 3 },
    { email: '4@email.com', isActive: true, companyId: 1, profileId: 4 },
    { email: '5@email.com', isActive: true, companyId: 1, profileId: 5 },
    { email: '6@email.com', isActive: true, companyId: 1, profileId: 6 },
    { email: '7@email.com', isActive: false, companyId: 1, profileId: 7 },
    { email: '8@email.com', isActive: false, companyId: 1, profileId: 8 },
    { email: '9@email.com', isActive: false, companyId: 1, profileId: 9 },
    { email: '10@email.com', isActive: true, companyId: 1, profileId: 10 },
    { email: '11@email.com', isActive: true, companyId: 2, profileId: 11 },
    { email: '12@email.com', isActive: true, companyId: 2, profileId: 12 },
    { email: '13@email.com', isActive: true, companyId: 2, profileId: 13 },
    { email: '14@email.com', isActive: true, companyId: 2, profileId: 14 },
    { email: '15@email.com', isActive: true, companyId: 2, profileId: 15 },
    { email: '16@email.com', isActive: true, companyId: 2, profileId: 16 },
    { email: '17@email.com', isActive: false, companyId: 2, profileId: 17 },
    { email: '18@email.com', isActive: false, companyId: 2, profileId: 18 },
    { email: '19@email.com', isActive: false, companyId: 2, profileId: 19 },
    { email: '20@email.com', isActive: false, companyId: 2, profileId: 20 },
  ]);
}
