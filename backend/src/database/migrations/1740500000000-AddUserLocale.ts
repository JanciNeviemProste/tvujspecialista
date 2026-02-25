import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserLocale1740500000000 implements MigrationInterface {
  name = 'AddUserLocale1740500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "locale" character varying NOT NULL DEFAULT 'cs'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "locale"`);
  }
}
