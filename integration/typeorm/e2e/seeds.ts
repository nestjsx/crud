import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeds1544303473346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // companies
    await queryRunner.query(`
      INSERT INTO public.companies ("name", "domain", "description") VALUES
      ('Test1', 'test1', 'Yet another cool corporation'),
      ('Test2', 'test2', 'Yet another cool corporation'),
      ('Test3', 'test3', 'Yet another cool corporation'),
      ('Test4', 'test4', NULL),
      ('Test5', 'test5', NULL),
      ('Test6', 'test6', 'Yet another cool corporation'),
      ('Test7', 'test7', 'Yet another cool corporation'),
      ('Test8', 'test8', 'Yet another cool corporation'),
      ('Test9', 'test9', 'Yet another cool corporation'),
      ('Test10', 'test10', 'Yet another cool corporation');
    `);

    // user-profiles
    await queryRunner.query(`
      INSERT INTO public.user_profiles ("firstName", "lastName") VALUES
      ('Mike', 'Smart'),
      ('Susan', 'Butterscotch'),
      ('Zach', 'Pigeon'),
      ('Andy', 'Grey'),
      ('Chloe', 'Malkovich'),
      ('Brad', 'Willis'),
      ('Suki', 'Sweet'),
      ('Ocean', 'Blast'),
      ('Zoe', 'Wu'),
      ('Mike', 'England'),
      ('Chris', 'Rabbit'),
      ('Mohammad', 'Bishop'),
      ('Barry', 'Chan'),
      ('Brad', 'Malkovich'),
      ('Chloe', 'Thunder'),
      ('Mike', 'Humble'),
      ('Beth', 'Sparkle'),
      ('Simon', 'Clifford'),
      ('Suzanne', 'Connor'),
      ('Gregory', 'Cox');
    `);

    // users
    await queryRunner.query(`
      INSERT INTO public.users ("email", "password", "isActive", "companyId", "profileId") VALUES
      ('8ismail.dz.393l@dlj6pdw4fjvi.ml', '9c81f2857e8f', true, 1, 1),
      ('6ayman_ns@dxmk148pvn.ml', '9c81f2857e8f', true, 1, 2),
      ('wlamia_rajaax@bskyb.gq', '9c81f2857e8f', true, 1, 3),
      ('lmickaela.fernanc@ua6htwfwqu6wj.gq', '9c81f2857e8f', true, 1, 4),
      ('jwass@h546ns6jaii.ml', '9c81f2857e8f', true, 1, 5),
      ('xcityvi@ehvgfwayspsfwukntpi.ga', '9c81f2857e8f', true, 1, 6),
      ('8badr_fantass@kulitlumpia6.ml', '9c81f2857e8f', false, 1, 7),
      ('dhacer111@vl2ivlyuzopeawoepx.tk', '9c81f2857e8f', false, 1, 8),
      ('2xnxnx@kulitlumpia8.cf', '9c81f2857e8f', false, 1, 9),
      ('salaaelbrins14b@kgxz6o3bs09c.gq', '9c81f2857e8f', false, 1, 10),
      ('iliri.mur@fvurtzuz9s.gq', '9c81f2857e8f', false, 2, 11),
      ('bhus@uo8fylspuwh9c.ml', '9c81f2857e8f', false, 2, 12),
      ('yademfer@topsecretvn.tk', '9c81f2857e8f', false, 2, 13),
      ('5rabah@zil4czsdz3mvauc2.gq', '9c81f2857e8f', false, 2, 14),
      ('jabdessamad.camaq@avioaero.ga', '9c81f2857e8f', false, 2, 15),
      ('ryuvr@e1y4anp6d5kikv.tk', '9c81f2857e8f', false, 2, 16),
      ('pmateuszgolda28@superalts.gq', '9c81f2857e8f', false, 2, 17),
      ('aoqazwsxed@cxpcgwodagut.tk', '9c81f2857e8f', false, 2, 18),
      ('fericapozzati7@k3zaraxg9t7e1f.ml', '9c81f2857e8f', false, 2, 19),
      ('os.s.l.ka@6-6-6.cf', '9c81f2857e8f', false, 2, 20);
    `);

    // projects
    await queryRunner.query(`
      INSERT INTO public.projects ("name", "description", "companyId")
      VALUES ('project1', 'project 1 desc', 1),
             ('project2', 'project 2 desc', 1),
             ('project3', 'project 3 desc', 1),
             ('project4', 'project 4 desc', 1),
             ('project5', 'project 5 desc', 1),
             ('project6', 'project 6 desc', 1),
             ('project7', 'project 7 desc', 1),
             ('project8', 'project 8 desc', 1),
             ('project9', 'project 9 desc', 2),
             ('project10', 'project 10 desc', 3),
             ('project11', 'project 11 desc', 4),
             ('project12', 'project 12 desc', 5),
             ('project13', 'project 13 desc', 6),
             ('project14', 'project 14 desc', 7),
             ('project15', 'project 15 desc', 8),
             ('project16', 'project 16 desc', 9);
    `);

    // tasks
    await queryRunner.query(`
    INSERT INTO public.tasks ("name", "status", "companyId", "projectId", "userId")
    VALUES ('task11', 'a', 1, 1, 1),
           ('task12', 'a', 1, 1, 1),
           ('task13', 'a', 1, 1, 1),
           ('task14', 'a', 1, 1, 1),
           ('task21', 'a', 1, 2, 2),
           ('task22', 'a', 1, 2, 2),
           ('task23', 'a', 1, 2, 2),
           ('task24', 'a', 1, 2, 2),
           ('task31', 'a', 1, 3, 3),
           ('task32', 'a', 1, 3, 3),
           ('task33', 'a', 1, 3, 3),
           ('task34', 'a', 1, 3, 3),
           ('task41', 'a', 1, 4, 4),
           ('task42', 'a', 1, 4, 4),
           ('task43', 'a', 1, 4, 4),
           ('task44', 'a', 1, 4, 4),
           ('task1', 'a', 1, 1, 5),
           ('task2', 'a', 1, 1, 5),
           ('task3', 'a', 1, 1, 5),
           ('task4', 'a', 1, 1, 5),
           ('task1', 'a', 1, 1, 6),
           ('task2', 'a', 1, 1, 6),
           ('task3', 'a', 1, 1, 6),
           ('task4', 'a', 1, 1, 6),
           ('task1', 'a', 1, 1, 7),
           ('task2', 'a', 1, 1, 7),
           ('task3', 'a', 1, 1, 7),
           ('task4', 'a', 1, 1, 7);
    `);

    // user projects
    await queryRunner.query(`
    INSERT INTO public.projects_users_users ("projectsId", "usersId")
    VALUES (1, 1),
           (1, 2),
           (1, 3),
           (1, 4),
           (1, 5),
           (1, 6),
           (1, 7),
           (1, 8),
           (1, 9),
           (2, 1),
           (2, 2),
           (2, 3),
           (2, 4),
           (2, 5),
           (2, 6),
           (2, 7),
           (2, 8),
           (2, 9);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // flush
    await queryRunner.query(
      `DELETE FROM public.tasks; ALTER SEQUENCE tasks_id_seq RESTART WITH 1;`,
    );
    await queryRunner.query(
      `DELETE FROM public.projects; ALTER SEQUENCE projects_id_seq RESTART WITH 1;`,
    );
    await queryRunner.query(
      `DELETE FROM public.users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`,
    );
    await queryRunner.query(
      `DELETE FROM public.user_profiles; ALTER SEQUENCE user_profiles_id_seq RESTART WITH 1;`,
    );
    await queryRunner.query(
      `DELETE FROM public.companies; ALTER SEQUENCE companies_id_seq RESTART WITH 1;`,
    );
  }
}
