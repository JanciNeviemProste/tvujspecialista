import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSpecialistFieldsOptional1743800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "category" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "location" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "yearsExperience" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "yearsExperience" SET DEFAULT 0`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "specialists" SET "category" = 'Finanční poradce' WHERE "category" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "specialists" SET "location" = '' WHERE "location" IS NULL`,
    );
    await queryRunner.query(
      `UPDATE "specialists" SET "yearsExperience" = 0 WHERE "yearsExperience" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "category" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "location" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" ALTER COLUMN "yearsExperience" SET NOT NULL`,
    );
  }
}
