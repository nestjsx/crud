import { MigrationInterface, QueryRunner } from 'typeorm';

export class Seeds1544303473346 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO public.heroes (name, "firstName", "lastName") VALUES
      ('Batman', 'Bruce', 'Wayne'),
      ('Batgirl', 'Barbara', 'Gordon');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DELETE FROM public.heroes`);
  }
}
