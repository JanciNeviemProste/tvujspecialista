import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnboarding1742800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "specialists"
        ADD COLUMN "onboardingCompleted" boolean NOT NULL DEFAULT false
    `);
    // Mark existing specialists as onboarded
    await queryRunner.query(`
      UPDATE "specialists" SET "onboardingCompleted" = true
      WHERE "bio" IS NOT NULL AND length("bio") > 10
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "specialists" DROP COLUMN "onboardingCompleted"
    `);
  }
}
