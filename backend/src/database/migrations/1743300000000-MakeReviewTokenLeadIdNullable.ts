import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeReviewTokenLeadIdNullable1743300000000
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review_tokens" ALTER COLUMN "leadId" DROP NOT NULL`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "review_tokens" SET "leadId" = gen_random_uuid() WHERE "leadId" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_tokens" ALTER COLUMN "leadId" SET NOT NULL`,
    );
  }
}
