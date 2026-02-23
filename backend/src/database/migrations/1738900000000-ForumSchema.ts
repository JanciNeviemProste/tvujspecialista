import { MigrationInterface, QueryRunner } from 'typeorm';

export class ForumSchema1738900000000 implements MigrationInterface {
  name = 'ForumSchema1738900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Forum categories
    await queryRunner.query(`
      CREATE TABLE "forum_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "description" text NOT NULL,
        "icon" character varying NOT NULL DEFAULT 'MessageSquare',
        "position" integer NOT NULL DEFAULT 0,
        "topicCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_forum_categories" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_forum_categories_slug" UNIQUE ("slug")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_forum_categories_position" ON "forum_categories" ("position")`);

    // Forum topics
    await queryRunner.query(`
      CREATE TABLE "forum_topics" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "categoryId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "content" text NOT NULL,
        "isPinned" boolean NOT NULL DEFAULT false,
        "isLocked" boolean NOT NULL DEFAULT false,
        "viewCount" integer NOT NULL DEFAULT 0,
        "replyCount" integer NOT NULL DEFAULT 0,
        "lastReplyAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_forum_topics" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_forum_topics_slug" UNIQUE ("slug"),
        CONSTRAINT "FK_forum_topics_categoryId" FOREIGN KEY ("categoryId") REFERENCES "forum_categories"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_topics_authorId" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_forum_topics_categoryId" ON "forum_topics" ("categoryId")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_topics_authorId" ON "forum_topics" ("authorId")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_topics_pinned_lastReply" ON "forum_topics" ("isPinned", "lastReplyAt")`);

    // Forum posts
    await queryRunner.query(`
      CREATE TABLE "forum_posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "topicId" uuid NOT NULL,
        "authorId" uuid NOT NULL,
        "content" text NOT NULL,
        "isEdited" boolean NOT NULL DEFAULT false,
        "editedAt" TIMESTAMP,
        "likesCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_forum_posts" PRIMARY KEY ("id"),
        CONSTRAINT "FK_forum_posts_topicId" FOREIGN KEY ("topicId") REFERENCES "forum_topics"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_posts_authorId" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_forum_posts_topicId" ON "forum_posts" ("topicId")`);
    await queryRunner.query(`CREATE INDEX "IDX_forum_posts_authorId" ON "forum_posts" ("authorId")`);

    // Forum likes
    await queryRunner.query(`
      CREATE TABLE "forum_likes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "postId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_forum_likes" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_forum_likes_post_user" UNIQUE ("postId", "userId"),
        CONSTRAINT "FK_forum_likes_postId" FOREIGN KEY ("postId") REFERENCES "forum_posts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_forum_likes_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Seed forum categories
    await queryRunner.query(`
      INSERT INTO "forum_categories" ("name", "slug", "description", "icon", "position") VALUES
      ('Nehnuteľnosti', 'nehnutelnosti', 'Diskusie o realitnom trhu, obchodoch a praktických radách pre realitných maklérov.', 'Home', 1),
      ('Financie', 'financie', 'Finančné produkty, regulácie, investície a tipy pre finančných poradcov.', 'DollarSign', 2),
      ('Právne otázky', 'pravne-otazky', 'Zmluvy, dane, legislatíva a právne aspekty podnikania.', 'Scale', 3),
      ('Kariéra a rozvoj', 'kariera-a-rozvoj', 'Networking, osobný rozvoj, motivácia a kariérne príležitosti.', 'TrendingUp', 4),
      ('Všeobecné', 'vseobecne', 'Ostatné témy, ktoré nezapadajú do iných kategórií.', 'MessageSquare', 5)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_likes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_posts"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_topics"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "forum_categories"`);
  }
}
