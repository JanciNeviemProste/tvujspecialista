import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegionsJsonb1742600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "specialists"
        ADD COLUMN "regions" jsonb NOT NULL DEFAULT '[]'::jsonb
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_specialist_regions" ON "specialists" USING GIN ("regions")
    `);

    await queryRunner.query(`
      UPDATE "specialists" SET "regions" = CASE
        WHEN "location" ILIKE '%Praha%' THEN '["cz-pha"]'::jsonb
        WHEN "location" ILIKE '%Brno%' THEN '["cz-jhm"]'::jsonb
        WHEN "location" ILIKE '%Ostrava%' THEN '["cz-msk"]'::jsonb
        WHEN "location" ILIKE '%Plzen%' OR "location" ILIKE '%Plzeň%' THEN '["cz-plk"]'::jsonb
        WHEN "location" ILIKE '%Liberec%' THEN '["cz-lbk"]'::jsonb
        WHEN "location" ILIKE '%Olomouc%' THEN '["cz-olk"]'::jsonb
        WHEN "location" ILIKE '%Budejov%' OR "location" ILIKE '%Budějov%' THEN '["cz-jhc"]'::jsonb
        WHEN "location" ILIKE '%Hradec%' THEN '["cz-hkk"]'::jsonb
        WHEN "location" ILIKE '%Pardubic%' THEN '["cz-pak"]'::jsonb
        WHEN "location" ILIKE '%Zlin%' OR "location" ILIKE '%Zlín%' THEN '["cz-zlk"]'::jsonb
        WHEN "location" ILIKE '%Bratislav%' THEN '["sk-bl"]'::jsonb
        WHEN "location" ILIKE '%Košic%' THEN '["sk-ki"]'::jsonb
        ELSE '[]'::jsonb
      END
      WHERE "regions" = '[]'::jsonb
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_specialist_regions"`);
    await queryRunner.query(`ALTER TABLE "specialists" DROP COLUMN "regions"`);
  }
}
