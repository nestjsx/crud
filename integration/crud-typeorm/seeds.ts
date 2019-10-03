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
      INSERT INTO public.projects ("name", "description", "isActive", "companyId") VALUES
      ('Project1', 'description1', true, 1),
      ('Project2', 'description2', true, 1),
      ('Project3', 'description3', true, 2),
      ('Project4', 'description4', true, 2),
      ('Project5', 'description5', true, 3),
      ('Project6', 'description6', true, 3),
      ('Project7', 'description7', true, 4),
      ('Project8', 'description8', true, 4),
      ('Project9', 'description9', true, 5),
      ('Project10', 'description10', true, 5),
      ('Project11', 'description11', false, 6),
      ('Project12', 'description12', false, 6),
      ('Project13', 'description13', false, 7),
      ('Project14', 'description14', false, 7),
      ('Project15', 'description15', false, 8),
      ('Project16', 'description16', false, 8),
      ('Project17', 'description17', false, 9),
      ('Project18', 'description18', false, 9),
      ('Project19', 'description19', false, 10),
      ('Project20', 'description20', false, 10);
    `);

    // user-profiles
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
      INSERT INTO public.users ("email", "isActive", "companyId", "profileId", "nameFirst", "nameLast") VALUES
      ('1@email.com', true, 1, 1, 'firstname1', 'lastname1'),
      ('2@email.com', true, 1, 2, NULL, NULL),
      ('3@email.com', true, 1, 3, NULL, NULL),
      ('4@email.com', true, 1, 4, NULL, NULL),
      ('5@email.com', true, 1, 5, NULL, NULL),
      ('6@email.com', true, 1, 6, NULL, NULL),
      ('7@email.com', false, 1, 7, NULL, NULL),
      ('8@email.com', false, 1, 8, NULL, NULL),
      ('9@email.com', false, 1, 9, NULL, NULL),
      ('10@email.com', true, 1, 10, NULL, NULL),
      ('11@email.com', true, 2, 11, NULL, NULL),
      ('12@email.com', true, 2, 12, NULL, NULL),
      ('13@email.com', true, 2, 13, NULL, NULL),
      ('14@email.com', true, 2, 14, NULL, NULL),
      ('15@email.com', true, 2, 15, NULL, NULL),
      ('16@email.com', true, 2, 16, NULL, NULL),
      ('17@email.com', false, 2, 17, NULL, NULL),
      ('18@email.com', false, 2, 18, NULL, NULL),
      ('19@email.com', false, 2, 19, NULL, NULL),
      ('20@email.com', false, 2, 20, NULL, NULL),
      ('21@email.com', false, 2, NULL, NULL, NULL);
    `);

    // licenses
    await queryRunner.query(`
      INSERT INTO public.licenses ("name") VALUES
      ('License1'),
      ('License2'),
      ('License3'),
      ('License4'),
      ('License5');
    `);

    // user-licenses
    await queryRunner.query(`
      INSERT INTO public.user_licenses ("userId", "licenseId", "yearsActive") VALUES
      (1, 1, 3),
      (1, 2, 5),
      (1, 4, 7),
      (2, 5, 1);
    `);

    // user-projects
    await queryRunner.query(`
      INSERT INTO public.user_projects ("projectId", "userId", "review") VALUES
      (1, 1, 'User project 1 1'),
      (1, 2, 'User project 1 2'),
      (2, 2, 'User project 2 2'),
      (3, 3, 'User project 3 3');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
