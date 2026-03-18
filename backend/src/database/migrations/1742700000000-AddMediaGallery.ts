import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMediaGallery1742700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "specialists"
        ADD COLUMN "mediaGallery" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "specialists"
        DROP COLUMN "mediaGallery"
    `);
  }
}
