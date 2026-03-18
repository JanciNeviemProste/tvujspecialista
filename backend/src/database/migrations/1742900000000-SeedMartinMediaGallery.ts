import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMartinMediaGallery1742900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const gallery = JSON.stringify([
      { type: 'image', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=600&fit=crop', caption: 'Konzultace s klientem' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop', caption: 'Analýza investičního portfolia' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', caption: 'Jak si vybrat správnou investiční strategii' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=600&h=600&fit=crop', caption: 'Finanční workshop Praha 2025' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=600&h=600&fit=crop', caption: 'Týmová porada' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=600&fit=crop', caption: 'Podpis smlouvy s klientem' },
    ]);

    await queryRunner.query(`
      UPDATE "specialists"
      SET "mediaGallery" = '${gallery}'::jsonb
      WHERE "slug" = 'martin-dvorak-financni-poradce-praha'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "specialists"
      SET "mediaGallery" = '[]'::jsonb
      WHERE "slug" = 'martin-dvorak-financni-poradce-praha'
    `);
  }
}
