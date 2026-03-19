import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMediaGalleryAndAvailability1742950000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Fix broken Unsplash URL for "Finanční workshop Praha" + re-apply gallery
    const gallery = JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=600&fit=crop', caption: 'Konzultace s klientem' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop', caption: 'Analýza investičního portfolia' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Jak si vybrat správnou investiční strategii' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=600&fit=crop', caption: 'Finanční workshop Praha 2025' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=600&h=600&fit=crop', caption: 'Týmová porada' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=600&fit=crop', caption: 'Podpis smlouvy s klientem' },
    ]);

    await queryRunner.query(
      `UPDATE "specialists" SET "mediaGallery" = $1::jsonb WHERE "slug" = 'martin-dvorak-financni-poradce-praha'`,
      [gallery],
    );

    // Update availability with times (simple-array = comma-separated text, NOT pg array)
    await queryRunner.query(
      `UPDATE "specialists" SET "availability" = $1 WHERE "slug" = 'martin-dvorak-financni-poradce-praha'`,
      ['Po 9:00-18:00,Út 9:00-18:00,St 10:00-18:00,Čt 9:00-16:00'],
    );

    await queryRunner.query(
      `UPDATE "specialists" SET "availability" = $1 WHERE "slug" = 'jan-novak-financni-poradce-praha'`,
      ['Po 9:00-17:00,Út 9:00-17:00,St 9:00-17:00,Čt 9:00-17:00,Pá 9:00-15:00'],
    );

    await queryRunner.query(
      `UPDATE "specialists" SET "availability" = $1 WHERE "slug" = 'petra-svobodova-financni-poradce-brno'`,
      ['Po 8:00-16:00,Út 8:00-16:00,St 8:00-16:00,Čt 8:00-16:00,Pá 8:00-14:00,So 9:00-12:00'],
    );

    // Update all remaining specialists that still have day-only availability
    await queryRunner.query(`
      UPDATE "specialists"
      SET "availability" = CASE
        WHEN length("availability") - length(replace("availability", ',', '')) >= 6
          THEN 'Po 8:00-18:00,Út 8:00-18:00,St 8:00-18:00,Čt 8:00-18:00,Pá 8:00-16:00,So 9:00-14:00,Ne 10:00-13:00'
        WHEN length("availability") - length(replace("availability", ',', '')) >= 5
          THEN 'Po 9:00-17:00,Út 9:00-17:00,St 9:00-17:00,Čt 9:00-17:00,Pá 9:00-15:00,So 10:00-13:00'
        WHEN length("availability") - length(replace("availability", ',', '')) >= 4
          THEN 'Po 9:00-17:00,Út 9:00-17:00,St 9:00-17:00,Čt 9:00-17:00,Pá 9:00-14:00'
        WHEN length("availability") - length(replace("availability", ',', '')) >= 3
          THEN 'Po 9:00-17:00,Út 9:00-17:00,St 9:00-17:00,Čt 9:00-16:00'
        ELSE "availability"
      END
      WHERE "availability" NOT LIKE '%:%'
        AND "availability" != ''
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No revert needed for data fixes
  }
}
