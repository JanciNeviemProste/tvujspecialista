import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProfilePhotos1743000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const updates = [
      { slug: 'jan-novak-financni-poradce-praha', photo: 'https://images.pexels.com/photos/5060991/pexels-photo-5060991.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'petra-svobodova-financni-poradce-brno', photo: 'https://images.pexels.com/photos/7550900/pexels-photo-7550900.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'martin-dvorak-financni-poradce-praha', photo: 'https://images.pexels.com/photos/7648248/pexels-photo-7648248.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'lucie-novotna-realitni-makler-ostrava', photo: 'https://images.pexels.com/photos/7222279/pexels-photo-7222279.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'katerina-mala-financni-poradce-brno', photo: 'https://images.pexels.com/photos/7580822/pexels-photo-7580822.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'jan-kral-financni-poradce-praha', photo: 'https://images.pexels.com/photos/7698739/pexels-photo-7698739.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'michaela-vesela-realitni-makler-praha', photo: 'https://images.pexels.com/photos/4964999/pexels-photo-4964999.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
      { slug: 'pavel-horak-financni-poradce-brno', photo: 'https://images.pexels.com/photos/5439472/pexels-photo-5439472.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop' },
    ];

    for (const { slug, photo } of updates) {
      await queryRunner.query(
        `UPDATE "specialists" SET "photo" = $1 WHERE "slug" = $2`,
        [photo, slug],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No revert — old placeholder photos are not worth restoring
  }
}
