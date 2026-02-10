import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1738800000000 implements MigrationInterface {
  name = 'InitialSchema1738800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // =============================================
    // 1. CREATE ALL ENUM TYPES
    // =============================================

    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM('customer', 'specialist', 'admin')`,
    );

    await queryRunner.query(
      `CREATE TYPE "user_subscription_type_enum" AS ENUM('none', 'education', 'marketplace', 'premium')`,
    );

    await queryRunner.query(
      `CREATE TYPE "specialist_category_enum" AS ENUM('Finanční poradce', 'Realitní makléř')`,
    );

    await queryRunner.query(
      `CREATE TYPE "subscription_tier_enum" AS ENUM('basic', 'pro', 'premium')`,
    );

    await queryRunner.query(
      `CREATE TYPE "subscription_status_enum" AS ENUM('active', 'past_due', 'canceled', 'unpaid', 'trialing')`,
    );

    await queryRunner.query(
      `CREATE TYPE "subscription_type_enum" AS ENUM('education', 'marketplace', 'premium')`,
    );

    await queryRunner.query(
      `CREATE TYPE "course_level_enum" AS ENUM('beginner', 'intermediate', 'advanced')`,
    );

    await queryRunner.query(
      `CREATE TYPE "course_category_enum" AS ENUM('real_estate', 'financial', 'both')`,
    );

    await queryRunner.query(
      `CREATE TYPE "lesson_type_enum" AS ENUM('video', 'quiz', 'reading', 'assignment')`,
    );

    await queryRunner.query(
      `CREATE TYPE "enrollment_status_enum" AS ENUM('active', 'completed', 'dropped')`,
    );

    await queryRunner.query(
      `CREATE TYPE "lead_status_enum" AS ENUM('new', 'contacted', 'qualified', 'in_progress', 'closed_won', 'closed_lost')`,
    );

    await queryRunner.query(
      `CREATE TYPE "lead_event_type_enum" AS ENUM('created', 'status_changed', 'note_added', 'email_sent')`,
    );

    await queryRunner.query(
      `CREATE TYPE "commission_status_enum" AS ENUM('pending', 'invoiced', 'paid', 'waived')`,
    );

    await queryRunner.query(
      `CREATE TYPE "event_type_enum" AS ENUM('workshop', 'networking', 'conference', 'webinar', 'meetup')`,
    );

    await queryRunner.query(
      `CREATE TYPE "event_format_enum" AS ENUM('online', 'offline')`,
    );

    await queryRunner.query(
      `CREATE TYPE "event_category_enum" AS ENUM('real_estate', 'financial', 'both')`,
    );

    await queryRunner.query(
      `CREATE TYPE "event_status_enum" AS ENUM('draft', 'published', 'cancelled', 'completed')`,
    );

    await queryRunner.query(
      `CREATE TYPE "rsvp_status_enum" AS ENUM('pending', 'confirmed', 'attended', 'cancelled')`,
    );

    await queryRunner.query(
      `CREATE TYPE "payment_status_enum" AS ENUM('none', 'pending', 'paid', 'refunded')`,
    );

    await queryRunner.query(
      `CREATE TYPE "video_status_enum" AS ENUM('uploading', 'processing', 'ready', 'error')`,
    );

    // =============================================
    // 2. CREATE TABLES (dependency order)
    // =============================================

    // --- users (no FK dependencies) ---
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "phone" character varying,
        "role" "user_role_enum" NOT NULL DEFAULT 'customer',
        "verified" boolean NOT NULL DEFAULT false,
        "subscriptionType" "user_subscription_type_enum" NOT NULL DEFAULT 'none',
        "educationSubscriptionExpiresAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    // --- specialists (FK -> users) ---
    await queryRunner.query(`
      CREATE TABLE "specialists" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "photo" character varying,
        "verified" boolean NOT NULL DEFAULT false,
        "topSpecialist" boolean NOT NULL DEFAULT false,
        "category" "specialist_category_enum" NOT NULL,
        "location" character varying NOT NULL,
        "bio" text NOT NULL DEFAULT '',
        "yearsExperience" integer NOT NULL,
        "hourlyRate" integer NOT NULL DEFAULT 0,
        "rating" numeric(3,2) NOT NULL DEFAULT 0,
        "reviewsCount" integer NOT NULL DEFAULT 0,
        "services" text NOT NULL DEFAULT '',
        "certifications" text NOT NULL DEFAULT '',
        "education" character varying NOT NULL DEFAULT '',
        "website" character varying,
        "linkedin" character varying,
        "facebook" character varying,
        "instagram" character varying,
        "leadCount" integer NOT NULL DEFAULT 0,
        "availability" text NOT NULL DEFAULT '',
        "subscriptionTier" "subscription_tier_enum" NOT NULL DEFAULT 'basic',
        "leadsThisMonth" integer NOT NULL DEFAULT 0,
        "subscriptionExpiresAt" TIMESTAMP,
        "commissionRate" numeric(5,4) NOT NULL DEFAULT 0.15,
        "totalCommissionPaid" numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_specialists" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_specialists_userId" UNIQUE ("userId"),
        CONSTRAINT "UQ_specialists_slug" UNIQUE ("slug"),
        CONSTRAINT "UQ_specialists_email" UNIQUE ("email")
      )
    `);

    // --- subscriptions (FK -> specialists, users) ---
    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "specialistId" character varying,
        "userId" character varying,
        "stripeCustomerId" character varying NOT NULL,
        "stripeSubscriptionId" character varying,
        "stripeSubscriptionItemId" character varying,
        "tier" "subscription_tier_enum",
        "subscriptionType" "subscription_type_enum" NOT NULL DEFAULT 'marketplace',
        "status" "subscription_status_enum" NOT NULL DEFAULT 'active',
        "currentPeriodStart" TIMESTAMP,
        "currentPeriodEnd" TIMESTAMP,
        "canceledAt" TIMESTAMP,
        "scheduledDowngradeTo" "subscription_type_enum",
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subscriptions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_subscriptions_stripeCustomerId" UNIQUE ("stripeCustomerId"),
        CONSTRAINT "UQ_subscriptions_stripeSubscriptionId" UNIQUE ("stripeSubscriptionId")
      )
    `);

    // --- courses (no FK dependencies) ---
    await queryRunner.query(`
      CREATE TABLE "courses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "thumbnailUrl" character varying NOT NULL,
        "level" "course_level_enum" NOT NULL DEFAULT 'beginner',
        "category" "course_category_enum" NOT NULL DEFAULT 'both',
        "instructorName" character varying NOT NULL,
        "instructorBio" text NOT NULL,
        "instructorPhoto" character varying NOT NULL,
        "duration" integer NOT NULL DEFAULT 0,
        "moduleCount" integer NOT NULL DEFAULT 0,
        "lessonCount" integer NOT NULL DEFAULT 0,
        "enrollmentCount" integer NOT NULL DEFAULT 0,
        "rating" numeric(3,2) NOT NULL DEFAULT 0,
        "reviewCount" integer NOT NULL DEFAULT 0,
        "published" boolean NOT NULL DEFAULT false,
        "featured" boolean NOT NULL DEFAULT false,
        "position" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_courses" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_courses_slug" UNIQUE ("slug")
      )
    `);

    // --- modules (FK -> courses) ---
    await queryRunner.query(`
      CREATE TABLE "modules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "courseId" character varying NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "duration" integer NOT NULL DEFAULT 0,
        "lessonCount" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_modules" PRIMARY KEY ("id")
      )
    `);

    // --- lessons (FK -> modules) ---
    await queryRunner.query(`
      CREATE TABLE "lessons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "moduleId" character varying NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "position" integer NOT NULL DEFAULT 0,
        "videoId" character varying,
        "duration" integer NOT NULL DEFAULT 0,
        "type" "lesson_type_enum" NOT NULL DEFAULT 'video',
        "content" jsonb,
        "published" boolean NOT NULL DEFAULT false,
        "free" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_lessons" PRIMARY KEY ("id")
      )
    `);

    // --- videos (FK -> lessons) ---
    await queryRunner.query(`
      CREATE TABLE "videos" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "lessonId" character varying,
        "title" character varying NOT NULL,
        "cloudinaryPublicId" character varying NOT NULL,
        "cloudinaryUrl" character varying NOT NULL,
        "duration" integer NOT NULL DEFAULT 0,
        "thumbnailUrl" character varying NOT NULL,
        "transcriptUrl" character varying,
        "resolution" character varying NOT NULL DEFAULT '720p',
        "fileSize" bigint NOT NULL DEFAULT 0,
        "uploadedAt" TIMESTAMP,
        "processedAt" TIMESTAMP,
        "status" "video_status_enum" NOT NULL DEFAULT 'uploading',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_videos" PRIMARY KEY ("id")
      )
    `);

    // --- enrollments (FK -> users, courses) ---
    await queryRunner.query(`
      CREATE TABLE "enrollments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "courseId" character varying NOT NULL,
        "status" "enrollment_status_enum" NOT NULL DEFAULT 'active',
        "progress" numeric(5,2) NOT NULL DEFAULT 0,
        "startedAt" TIMESTAMP NOT NULL,
        "completedAt" TIMESTAMP,
        "lastAccessedAt" TIMESTAMP NOT NULL,
        "certificateIssued" boolean NOT NULL DEFAULT false,
        "certificateIssuedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_enrollments" PRIMARY KEY ("id")
      )
    `);

    // --- lesson_progress (FK -> enrollments, lessons) ---
    await queryRunner.query(`
      CREATE TABLE "lesson_progress" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "enrollmentId" character varying NOT NULL,
        "lessonId" character varying NOT NULL,
        "completed" boolean NOT NULL DEFAULT false,
        "watchTimeSeconds" integer NOT NULL DEFAULT 0,
        "completedAt" TIMESTAMP,
        "lastWatchedAt" TIMESTAMP NOT NULL,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_lesson_progress" PRIMARY KEY ("id")
      )
    `);

    // --- leads (shared table for Lead and Deal entities, FK -> specialists, commissions) ---
    await queryRunner.query(`
      CREATE TABLE "leads" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "specialistId" character varying NOT NULL,
        "customerName" character varying NOT NULL,
        "customerEmail" character varying NOT NULL,
        "customerPhone" character varying NOT NULL,
        "message" text NOT NULL,
        "status" "lead_status_enum" NOT NULL DEFAULT 'new',
        "notes" text NOT NULL DEFAULT '',
        "gdprConsent" boolean NOT NULL DEFAULT true,
        "dealValue" numeric(12,2),
        "estimatedCloseDate" date,
        "actualCloseDate" date,
        "commissionId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_leads" PRIMARY KEY ("id")
      )
    `);

    // --- lead_events (FK -> leads) ---
    await queryRunner.query(`
      CREATE TABLE "lead_events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "leadId" character varying NOT NULL,
        "type" "lead_event_type_enum" NOT NULL,
        "data" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_lead_events" PRIMARY KEY ("id")
      )
    `);

    // --- reviews (FK -> specialists) ---
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "specialistId" character varying NOT NULL,
        "customerName" character varying NOT NULL,
        "customerEmail" character varying NOT NULL,
        "rating" integer NOT NULL,
        "comment" text NOT NULL,
        "verified" boolean NOT NULL DEFAULT false,
        "published" boolean NOT NULL DEFAULT false,
        "specialistResponse" text,
        "respondedAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id")
      )
    `);

    // --- commissions (FK -> leads/deals, specialists) ---
    await queryRunner.query(`
      CREATE TABLE "commissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "dealId" character varying NOT NULL,
        "specialistId" character varying NOT NULL,
        "dealValue" numeric(12,2) NOT NULL,
        "commissionRate" numeric(5,4) NOT NULL,
        "commissionAmount" numeric(12,2) NOT NULL,
        "status" "commission_status_enum" NOT NULL DEFAULT 'pending',
        "calculatedAt" TIMESTAMP NOT NULL,
        "dueDate" TIMESTAMP NOT NULL,
        "invoicedAt" TIMESTAMP,
        "paidAt" TIMESTAMP,
        "stripePaymentIntentId" character varying,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_commissions" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_commissions_dealId" UNIQUE ("dealId")
      )
    `);

    // --- events (FK -> users) ---
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "slug" character varying NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "type" "event_type_enum" NOT NULL DEFAULT 'meetup',
        "format" "event_format_enum" NOT NULL DEFAULT 'online',
        "category" "event_category_enum" NOT NULL DEFAULT 'both',
        "bannerImage" character varying,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "timezone" character varying NOT NULL DEFAULT 'Europe/Prague',
        "location" character varying,
        "address" text,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "meetingLink" character varying,
        "meetingPassword" character varying,
        "organizerId" character varying NOT NULL,
        "maxAttendees" integer,
        "attendeeCount" integer NOT NULL DEFAULT 0,
        "price" numeric(10,2) NOT NULL DEFAULT 0,
        "currency" character varying NOT NULL DEFAULT 'CZK',
        "status" "event_status_enum" NOT NULL DEFAULT 'draft',
        "published" boolean NOT NULL DEFAULT false,
        "featured" boolean NOT NULL DEFAULT false,
        "tags" text[] NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_events_slug" UNIQUE ("slug")
      )
    `);

    // --- rsvps (FK -> events, users) ---
    await queryRunner.query(`
      CREATE TABLE "rsvps" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "eventId" character varying NOT NULL,
        "userId" character varying NOT NULL,
        "status" "rsvp_status_enum" NOT NULL DEFAULT 'pending',
        "registeredAt" TIMESTAMP NOT NULL,
        "confirmedAt" TIMESTAMP,
        "attendedAt" TIMESTAMP,
        "cancelledAt" TIMESTAMP,
        "paymentStatus" "payment_status_enum" NOT NULL DEFAULT 'none',
        "stripePaymentIntentId" character varying,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rsvps" PRIMARY KEY ("id")
      )
    `);

    // --- refresh_tokens (FK -> users) ---
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying NOT NULL,
        "token" character varying NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_refresh_tokens_token" UNIQUE ("token")
      )
    `);

    // --- review_tokens (no explicit FK in entity) ---
    await queryRunner.query(`
      CREATE TABLE "review_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "specialistId" character varying NOT NULL,
        "leadId" character varying NOT NULL,
        "customerEmail" character varying NOT NULL,
        "used" boolean NOT NULL DEFAULT false,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_review_tokens" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_review_tokens_token" UNIQUE ("token")
      )
    `);

    // =============================================
    // 3. CREATE INDEXES
    // =============================================

    // --- specialists indexes ---
    // @Index(['category', 'location'])
    await queryRunner.query(
      `CREATE INDEX "IDX_specialists_category_location" ON "specialists" ("category", "location")`,
    );
    // @Index(['rating'])
    await queryRunner.query(
      `CREATE INDEX "IDX_specialists_rating" ON "specialists" ("rating")`,
    );

    // --- subscriptions indexes ---
    // @Index(['specialistId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_subscriptions_specialistId" ON "subscriptions" ("specialistId")`,
    );
    // @Index(['userId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_subscriptions_userId" ON "subscriptions" ("userId")`,
    );
    // @Index(['stripeSubscriptionId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_subscriptions_stripeSubscriptionId" ON "subscriptions" ("stripeSubscriptionId")`,
    );

    // --- courses indexes ---
    // @Index(['slug'], { unique: true }) -- already covered by UNIQUE constraint
    // @Index(['category', 'published'])
    await queryRunner.query(
      `CREATE INDEX "IDX_courses_category_published" ON "courses" ("category", "published")`,
    );
    // @Index(['featured', 'published'])
    await queryRunner.query(
      `CREATE INDEX "IDX_courses_featured_published" ON "courses" ("featured", "published")`,
    );

    // --- modules indexes ---
    // @Index(['courseId', 'position'])
    await queryRunner.query(
      `CREATE INDEX "IDX_modules_courseId_position" ON "modules" ("courseId", "position")`,
    );

    // --- lessons indexes ---
    // @Index(['moduleId', 'position'])
    await queryRunner.query(
      `CREATE INDEX "IDX_lessons_moduleId_position" ON "lessons" ("moduleId", "position")`,
    );

    // --- enrollments indexes ---
    // @Index(['userId', 'courseId'], { unique: true })
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_enrollments_userId_courseId" ON "enrollments" ("userId", "courseId")`,
    );
    // @Index(['userId', 'status'])
    await queryRunner.query(
      `CREATE INDEX "IDX_enrollments_userId_status" ON "enrollments" ("userId", "status")`,
    );

    // --- lesson_progress indexes ---
    // @Index(['enrollmentId', 'lessonId'], { unique: true })
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_lesson_progress_enrollmentId_lessonId" ON "lesson_progress" ("enrollmentId", "lessonId")`,
    );

    // --- leads indexes ---
    // @Index(['specialistId', 'createdAt']) (from both Lead and Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_specialistId_createdAt" ON "leads" ("specialistId", "createdAt")`,
    );
    // @Index(['status']) (from both Lead and Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_status" ON "leads" ("status")`,
    );
    // @Index(['specialistId', 'status']) (from Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_specialistId_status" ON "leads" ("specialistId", "status")`,
    );
    // @Index(['estimatedCloseDate']) (from Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_estimatedCloseDate" ON "leads" ("estimatedCloseDate")`,
    );
    // @Index(['dealValue']) (from Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_dealValue" ON "leads" ("dealValue")`,
    );
    // @Index(['actualCloseDate']) (from Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_actualCloseDate" ON "leads" ("actualCloseDate")`,
    );
    // @Index() on specialistId column (from Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_specialistId" ON "leads" ("specialistId")`,
    );
    // @Index() on customerEmail column (from Deal)
    await queryRunner.query(
      `CREATE INDEX "IDX_leads_customerEmail" ON "leads" ("customerEmail")`,
    );

    // --- lead_events indexes ---
    // @Index(['leadId', 'createdAt'])
    await queryRunner.query(
      `CREATE INDEX "IDX_lead_events_leadId_createdAt" ON "lead_events" ("leadId", "createdAt")`,
    );
    // @Index(['type'])
    await queryRunner.query(
      `CREATE INDEX "IDX_lead_events_type" ON "lead_events" ("type")`,
    );
    // @Index(['leadId', 'type'])
    await queryRunner.query(
      `CREATE INDEX "IDX_lead_events_leadId_type" ON "lead_events" ("leadId", "type")`,
    );
    // @Index() on leadId column
    await queryRunner.query(
      `CREATE INDEX "IDX_lead_events_leadId" ON "lead_events" ("leadId")`,
    );
    // @Index() on createdAt column
    await queryRunner.query(
      `CREATE INDEX "IDX_lead_events_createdAt" ON "lead_events" ("createdAt")`,
    );

    // --- reviews indexes ---
    // @Index(['specialistId', 'published'])
    await queryRunner.query(
      `CREATE INDEX "IDX_reviews_specialistId_published" ON "reviews" ("specialistId", "published")`,
    );
    // @Index(['createdAt'])
    await queryRunner.query(
      `CREATE INDEX "IDX_reviews_createdAt" ON "reviews" ("createdAt")`,
    );

    // --- commissions indexes ---
    // @Index(['dealId'], { unique: true }) -- already covered by UNIQUE constraint
    // @Index(['specialistId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_specialistId" ON "commissions" ("specialistId")`,
    );
    // @Index(['status'])
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_status" ON "commissions" ("status")`,
    );
    // @Index(['dueDate'])
    await queryRunner.query(
      `CREATE INDEX "IDX_commissions_dueDate" ON "commissions" ("dueDate")`,
    );

    // --- events indexes ---
    // @Index(['slug'], { unique: true }) -- already covered by UNIQUE constraint
    // @Index(['organizerId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_events_organizerId" ON "events" ("organizerId")`,
    );
    // @Index(['startDate'])
    await queryRunner.query(
      `CREATE INDEX "IDX_events_startDate" ON "events" ("startDate")`,
    );
    // @Index(['category', 'published'])
    await queryRunner.query(
      `CREATE INDEX "IDX_events_category_published" ON "events" ("category", "published")`,
    );
    // @Index(['featured', 'published'])
    await queryRunner.query(
      `CREATE INDEX "IDX_events_featured_published" ON "events" ("featured", "published")`,
    );

    // --- rsvps indexes ---
    // @Index(['eventId', 'userId'], { unique: true })
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_rsvps_eventId_userId" ON "rsvps" ("eventId", "userId")`,
    );
    // @Index(['userId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_rsvps_userId" ON "rsvps" ("userId")`,
    );
    // @Index(['eventId', 'status'])
    await queryRunner.query(
      `CREATE INDEX "IDX_rsvps_eventId_status" ON "rsvps" ("eventId", "status")`,
    );

    // --- refresh_tokens indexes ---
    // @Index(['userId'])
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_userId" ON "refresh_tokens" ("userId")`,
    );
    // @Index(['token'])
    await queryRunner.query(
      `CREATE INDEX "IDX_refresh_tokens_token" ON "refresh_tokens" ("token")`,
    );

    // =============================================
    // 4. CREATE FOREIGN KEY CONSTRAINTS
    // =============================================

    // specialists.userId -> users.id (OneToOne)
    await queryRunner.query(`
      ALTER TABLE "specialists"
        ADD CONSTRAINT "FK_specialists_userId"
        FOREIGN KEY ("userId") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // modules.courseId -> courses.id (ManyToOne, onDelete: CASCADE)
    await queryRunner.query(`
      ALTER TABLE "modules"
        ADD CONSTRAINT "FK_modules_courseId"
        FOREIGN KEY ("courseId") REFERENCES "courses"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // lessons.moduleId -> modules.id (ManyToOne, onDelete: CASCADE)
    await queryRunner.query(`
      ALTER TABLE "lessons"
        ADD CONSTRAINT "FK_lessons_moduleId"
        FOREIGN KEY ("moduleId") REFERENCES "modules"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // videos.lessonId -> lessons.id (OneToOne, onDelete: CASCADE)
    await queryRunner.query(`
      ALTER TABLE "videos"
        ADD CONSTRAINT "FK_videos_lessonId"
        FOREIGN KEY ("lessonId") REFERENCES "lessons"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // enrollments.userId -> users.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "enrollments"
        ADD CONSTRAINT "FK_enrollments_userId"
        FOREIGN KEY ("userId") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // enrollments.courseId -> courses.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "enrollments"
        ADD CONSTRAINT "FK_enrollments_courseId"
        FOREIGN KEY ("courseId") REFERENCES "courses"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // lesson_progress.enrollmentId -> enrollments.id (ManyToOne, onDelete: CASCADE)
    await queryRunner.query(`
      ALTER TABLE "lesson_progress"
        ADD CONSTRAINT "FK_lesson_progress_enrollmentId"
        FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // lesson_progress.lessonId -> lessons.id (ManyToOne, onDelete: CASCADE)
    await queryRunner.query(`
      ALTER TABLE "lesson_progress"
        ADD CONSTRAINT "FK_lesson_progress_lessonId"
        FOREIGN KEY ("lessonId") REFERENCES "lessons"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // leads.specialistId -> specialists.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "leads"
        ADD CONSTRAINT "FK_leads_specialistId"
        FOREIGN KEY ("specialistId") REFERENCES "specialists"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // leads.commissionId -> commissions.id (OneToOne, nullable)
    await queryRunner.query(`
      ALTER TABLE "leads"
        ADD CONSTRAINT "FK_leads_commissionId"
        FOREIGN KEY ("commissionId") REFERENCES "commissions"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // lead_events.leadId -> leads.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "lead_events"
        ADD CONSTRAINT "FK_lead_events_leadId"
        FOREIGN KEY ("leadId") REFERENCES "leads"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // reviews.specialistId -> specialists.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "reviews"
        ADD CONSTRAINT "FK_reviews_specialistId"
        FOREIGN KEY ("specialistId") REFERENCES "specialists"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // commissions.dealId -> leads.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "commissions"
        ADD CONSTRAINT "FK_commissions_dealId"
        FOREIGN KEY ("dealId") REFERENCES "leads"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // commissions.specialistId -> specialists.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "commissions"
        ADD CONSTRAINT "FK_commissions_specialistId"
        FOREIGN KEY ("specialistId") REFERENCES "specialists"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // events.organizerId -> users.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "events"
        ADD CONSTRAINT "FK_events_organizerId"
        FOREIGN KEY ("organizerId") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // rsvps.eventId -> events.id (ManyToOne, onDelete: CASCADE)
    await queryRunner.query(`
      ALTER TABLE "rsvps"
        ADD CONSTRAINT "FK_rsvps_eventId"
        FOREIGN KEY ("eventId") REFERENCES "events"("id")
        ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // rsvps.userId -> users.id (ManyToOne)
    await queryRunner.query(`
      ALTER TABLE "rsvps"
        ADD CONSTRAINT "FK_rsvps_userId"
        FOREIGN KEY ("userId") REFERENCES "users"("id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    // refresh_tokens - no explicit FK in entity, but logical reference
    // (Not adding FK since the entity does not declare @ManyToOne)

    // review_tokens - no explicit FK in entity
    // (Not adding FK since the entity does not declare any relation decorators)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // =============================================
    // 1. DROP FOREIGN KEY CONSTRAINTS (reverse order)
    // =============================================

    await queryRunner.query(
      `ALTER TABLE "rsvps" DROP CONSTRAINT "FK_rsvps_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rsvps" DROP CONSTRAINT "FK_rsvps_eventId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_events_organizerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commissions" DROP CONSTRAINT "FK_commissions_specialistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "commissions" DROP CONSTRAINT "FK_commissions_dealId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_reviews_specialistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lead_events" DROP CONSTRAINT "FK_lead_events_leadId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_leads_commissionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "leads" DROP CONSTRAINT "FK_leads_specialistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_lesson_progress_lessonId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_lesson_progress_enrollmentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_courseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enrollments" DROP CONSTRAINT "FK_enrollments_userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "videos" DROP CONSTRAINT "FK_videos_lessonId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_lessons_moduleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "modules" DROP CONSTRAINT "FK_modules_courseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specialists" DROP CONSTRAINT "FK_specialists_userId"`,
    );

    // =============================================
    // 2. DROP INDEXES (reverse order)
    // =============================================

    // refresh_tokens indexes
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_token"`);
    await queryRunner.query(`DROP INDEX "IDX_refresh_tokens_userId"`);

    // rsvps indexes
    await queryRunner.query(`DROP INDEX "IDX_rsvps_eventId_status"`);
    await queryRunner.query(`DROP INDEX "IDX_rsvps_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_rsvps_eventId_userId"`);

    // events indexes
    await queryRunner.query(`DROP INDEX "IDX_events_featured_published"`);
    await queryRunner.query(`DROP INDEX "IDX_events_category_published"`);
    await queryRunner.query(`DROP INDEX "IDX_events_startDate"`);
    await queryRunner.query(`DROP INDEX "IDX_events_organizerId"`);

    // commissions indexes
    await queryRunner.query(`DROP INDEX "IDX_commissions_dueDate"`);
    await queryRunner.query(`DROP INDEX "IDX_commissions_status"`);
    await queryRunner.query(`DROP INDEX "IDX_commissions_specialistId"`);

    // reviews indexes
    await queryRunner.query(`DROP INDEX "IDX_reviews_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_reviews_specialistId_published"`);

    // lead_events indexes
    await queryRunner.query(`DROP INDEX "IDX_lead_events_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_lead_events_leadId"`);
    await queryRunner.query(`DROP INDEX "IDX_lead_events_leadId_type"`);
    await queryRunner.query(`DROP INDEX "IDX_lead_events_type"`);
    await queryRunner.query(`DROP INDEX "IDX_lead_events_leadId_createdAt"`);

    // leads indexes
    await queryRunner.query(`DROP INDEX "IDX_leads_customerEmail"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_specialistId"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_actualCloseDate"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_dealValue"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_estimatedCloseDate"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_specialistId_status"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_status"`);
    await queryRunner.query(`DROP INDEX "IDX_leads_specialistId_createdAt"`);

    // lesson_progress indexes
    await queryRunner.query(
      `DROP INDEX "IDX_lesson_progress_enrollmentId_lessonId"`,
    );

    // enrollments indexes
    await queryRunner.query(`DROP INDEX "IDX_enrollments_userId_status"`);
    await queryRunner.query(`DROP INDEX "IDX_enrollments_userId_courseId"`);

    // lessons indexes
    await queryRunner.query(`DROP INDEX "IDX_lessons_moduleId_position"`);

    // modules indexes
    await queryRunner.query(`DROP INDEX "IDX_modules_courseId_position"`);

    // courses indexes
    await queryRunner.query(`DROP INDEX "IDX_courses_featured_published"`);
    await queryRunner.query(`DROP INDEX "IDX_courses_category_published"`);

    // subscriptions indexes
    await queryRunner.query(
      `DROP INDEX "IDX_subscriptions_stripeSubscriptionId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_subscriptions_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_subscriptions_specialistId"`);

    // specialists indexes
    await queryRunner.query(`DROP INDEX "IDX_specialists_rating"`);
    await queryRunner.query(`DROP INDEX "IDX_specialists_category_location"`);

    // =============================================
    // 3. DROP TABLES (reverse dependency order)
    // =============================================

    await queryRunner.query(`DROP TABLE "review_tokens"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "rsvps"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "commissions"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "lead_events"`);
    await queryRunner.query(`DROP TABLE "leads"`);
    await queryRunner.query(`DROP TABLE "lesson_progress"`);
    await queryRunner.query(`DROP TABLE "enrollments"`);
    await queryRunner.query(`DROP TABLE "videos"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(`DROP TABLE "modules"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "specialists"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // =============================================
    // 4. DROP ENUM TYPES
    // =============================================

    await queryRunner.query(`DROP TYPE "video_status_enum"`);
    await queryRunner.query(`DROP TYPE "payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "rsvp_status_enum"`);
    await queryRunner.query(`DROP TYPE "event_status_enum"`);
    await queryRunner.query(`DROP TYPE "event_category_enum"`);
    await queryRunner.query(`DROP TYPE "event_format_enum"`);
    await queryRunner.query(`DROP TYPE "event_type_enum"`);
    await queryRunner.query(`DROP TYPE "commission_status_enum"`);
    await queryRunner.query(`DROP TYPE "lead_event_type_enum"`);
    await queryRunner.query(`DROP TYPE "lead_status_enum"`);
    await queryRunner.query(`DROP TYPE "enrollment_status_enum"`);
    await queryRunner.query(`DROP TYPE "lesson_type_enum"`);
    await queryRunner.query(`DROP TYPE "course_category_enum"`);
    await queryRunner.query(`DROP TYPE "course_level_enum"`);
    await queryRunner.query(`DROP TYPE "subscription_type_enum"`);
    await queryRunner.query(`DROP TYPE "subscription_status_enum"`);
    await queryRunner.query(`DROP TYPE "subscription_tier_enum"`);
    await queryRunner.query(`DROP TYPE "specialist_category_enum"`);
    await queryRunner.query(`DROP TYPE "user_subscription_type_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
