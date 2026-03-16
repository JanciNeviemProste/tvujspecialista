import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCrmFields1741900000000 implements MigrationInterface {
  // ALTER TYPE ADD VALUE cannot run inside a transaction in PostgreSQL
  public readonly transaction = false;

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create CRM provider enum type
    await queryRunner.query(`
      CREATE TYPE "specialists_crmprovider_enum" AS ENUM('none','ovb','partner_group','four_fin')
    `);

    // 2. Add CRM columns to specialists
    await queryRunner.query(`
      ALTER TABLE "specialists"
        ADD COLUMN "crmProvider" "specialists_crmprovider_enum" NOT NULL DEFAULT 'none',
        ADD COLUMN "crmTipsterAccount" character varying
    `);

    // 3. Add CRM tracking columns to leads
    await queryRunner.query(`
      ALTER TABLE "leads"
        ADD COLUMN "crmExternalId" character varying,
        ADD COLUMN "crmPushedAt" TIMESTAMP,
        ADD COLUMN "crmPushError" character varying
    `);

    // 4. Extend lead_event_type_enum with CRM values
    await queryRunner.query(`ALTER TYPE "lead_event_type_enum" ADD VALUE IF NOT EXISTS 'crm_pushed'`);
    await queryRunner.query(`ALTER TYPE "lead_event_type_enum" ADD VALUE IF NOT EXISTS 'crm_push_failed'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leads"
        DROP COLUMN "crmPushError",
        DROP COLUMN "crmPushedAt",
        DROP COLUMN "crmExternalId"
    `);
    await queryRunner.query(`
      ALTER TABLE "specialists"
        DROP COLUMN "crmTipsterAccount",
        DROP COLUMN "crmProvider"
    `);
    await queryRunner.query(`DROP TYPE "specialists_crmprovider_enum"`);
  }
}
