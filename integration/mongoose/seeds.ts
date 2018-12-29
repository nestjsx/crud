import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeds1544303473346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    // companies
    await queryRunner.query(`
      INSERT INTO public.companies ("name", "domain", "description") VALUES
      ('Google', 'google', 'Cool corporation'),
      ('Microsoft', 'microsoft', 'Another cool corporation'),
      ('Amazon', 'amazon', 'Yet another cool corporation');
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
      ('iliri.mur@fvurtzuz9s.gq', '9c81f2857e8f', false, 1, 11),
      ('bhus@uo8fylspuwh9c.ml', '9c81f2857e8f', false, 1, 12),
      ('yademfer@topsecretvn.tk', '9c81f2857e8f', false, 1, 13),
      ('5rabah@zil4czsdz3mvauc2.gq', '9c81f2857e8f', false, 1, 14),
      ('jabdessamad.camaq@avioaero.ga', '9c81f2857e8f', false, 1, 15),
      ('ryuvr@e1y4anp6d5kikv.tk', '9c81f2857e8f', false, 1, 16),
      ('pmateuszgolda28@superalts.gq', '9c81f2857e8f', false, 1, 17),
      ('aoqazwsxed@cxpcgwodagut.tk', '9c81f2857e8f', false, 1, 18),
      ('fericapozzati7@k3zaraxg9t7e1f.ml', '9c81f2857e8f', false, 1, 19),
      ('os.s.l.ka@6-6-6.cf', '9c81f2857e8f', false, 1, 20);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    // flush
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
