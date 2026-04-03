import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecalculateTopSpecialist1743200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE specialists
      SET "topSpecialist" = false
      WHERE "reviewsCount" < 150 OR rating < 4.0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Cannot restore previous topSpecialist values
  }
}
