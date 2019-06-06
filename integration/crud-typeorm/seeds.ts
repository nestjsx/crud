import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeds1544303473346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // companies
    await queryRunner.query(`
      INSERT INTO public.companies ("name", "domain") VALUES
      ('Name1', 'Domain1'),
      ('Name2', 'Domain2'),
      ('Name3', 'Domain3'),
      ('Name4', 'Domain4'),
      ('Name5', 'Domain5'),
      ('Name6', 'Domain6'),
      ('Name7', 'Domain7'),
      ('Name8', 'Domain8'),
      ('Name9', 'Domain9'),
      ('Name10', 'Domain10');
    `);

    // projects
    await queryRunner.query(`
      INSERT INTO public.projects ("name", "companyId") VALUES
      ('Project1', 1),
      ('Project2', 1),
      ('Project3', 2),
      ('Project4', 2),
      ('Project5', 3),
      ('Project6', 3),
      ('Project7', 4),
      ('Project8', 4),
      ('Project9', 5),
      ('Project10', 5),
      ('Project11', 6),
      ('Project12', 6),
      ('Project13', 7),
      ('Project14', 7),
      ('Project15', 8),
      ('Project16', 8),
      ('Project17', 9),
      ('Project18', 9),
      ('Project19', 10),
      ('Project20', 10);
    `);

    // users-profiles
    await queryRunner.query(`
      INSERT INTO public.user_profiles ("name") VALUES
      ('User1'),
      ('User2'),
      ('User3'),
      ('User4'),
      ('User5'),
      ('User6'),
      ('User7'),
      ('User8'),
      ('User9'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User1'),
      ('User2');
    `);

    // users
    await queryRunner.query(`
      INSERT INTO public.users ("email", "isActive", "companyId", "profileId") VALUES
      ('1@email.com', true, 1, 1),
      ('2@email.com', true, 1, 2),
      ('3@email.com', true, 1, 3),
      ('4@email.com', true, 1, 4),
      ('5@email.com', true, 1, 5),
      ('6@email.com', true, 1, 6),
      ('7@email.com', false, 1, 7),
      ('8@email.com', false, 1, 8),
      ('9@email.com', false, 1, 9),
      ('10@email.com', true, 1, 10),
      ('11@email.com', true, 2, 11),
      ('12@email.com', true, 2, 12),
      ('13@email.com', true, 2, 13),
      ('14@email.com', true, 2, 14),
      ('15@email.com', true, 2, 15),
      ('16@email.com', true, 2, 16),
      ('17@email.com', false, 2, 17),
      ('18@email.com', false, 2, 18),
      ('19@email.com', false, 2, 19),
      ('20@email.com', false, 2, 20);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
