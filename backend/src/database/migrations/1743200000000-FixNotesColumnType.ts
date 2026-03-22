import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNotesColumnType1743200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // The entity declares notes as jsonb but the InitialSchema migration created it as text.
    // Convert existing text data to jsonb. Empty strings become '[]'.
    await queryRunner.query(`
      UPDATE "leads"
      SET "notes" = '[]'
      WHERE "notes" = '' OR "notes" IS NULL
    `);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "notes" TYPE jsonb USING notes::jsonb`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "notes" SET DEFAULT '[]'::jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "notes" TYPE text USING notes::text`);
    await queryRunner.query(`ALTER TABLE "leads" ALTER COLUMN "notes" SET DEFAULT ''`);
  }
}
