import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeyIndexes1743100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Only create indexes if they don't exist
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_lead_event_leadId" ON "lead_events" ("leadId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_commission_dealId" ON "commissions" ("dealId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_commission_specialistId" ON "commissions" ("specialistId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_review_specialistId" ON "reviews" ("specialistId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rsvp_eventId" ON "rsvps" ("eventId")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rsvp_userId" ON "rsvps" ("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_lead_event_leadId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_commission_dealId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_commission_specialistId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_review_specialistId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_rsvp_eventId"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_rsvp_userId"`);
  }
}
