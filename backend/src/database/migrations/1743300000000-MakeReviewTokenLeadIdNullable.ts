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
    // Delete orphaned tokens that have no leadId (can't restore them)
    await queryRunner.query(`DELETE FROM "review_tokens" WHERE "leadId" IS NULL`);
    // Now restore NOT NULL constraint
    await queryRunner.query(`ALTER TABLE "review_tokens" ALTER COLUMN "leadId" SET NOT NULL`);
  }
}
