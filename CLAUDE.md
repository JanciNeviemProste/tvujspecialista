# tvujspecialista.cz

## Architecture

- **Frontend:** Next.js 16 + React 19 (App Router) deployed on Vercel
- **Backend:** NestJS 11 + TypeORM deployed on Railway
- **Database:** PostgreSQL (synchronize: false, migrationsRun: true)
- **Media:** Cloudinary (profiles, events, academy)
- **Email:** Resend
- **Payments:** Stripe (subscriptions)
- **Monitoring:** Sentry (both frontend and backend)
- **i18n:** next-intl with 4 locales (cs, sk, en, pl)

## Project Structure

```
app/[locale]/                 # Next.js pages with locale routing
  hledat/                     # Specialist search page
  specialista/[slug]/         # Specialist public profile
  ceny/                       # Pricing page
  kontakt/                    # Contact page
  o-nas/                      # About page
  academy/                    # Academy (courses, videos)
  community/                  # Events, community
  forum/                      # Forum
  profi/                      # Specialist/admin dashboard
    prihlaseni/               # Login
    registrace/               # Registration
    overenie-emailu/          # Email verification
    zapomenute-heslo/         # Forgot password
    reset-hesla/              # Password reset
    dashboard/                # Main dashboard
      deals/                  # Lead pipeline (Kanban)
      recenze/                # Reviews management
      profil/                 # Profile edit
      nastaveni/              # Settings
      commissions/            # Commissions
      admin/                  # Admin panel
components/                   # React components
  deals/                      # DealCard, DealKanban, DealDetailModal
  shared/                     # SpecialistCard, ScrollReveal, AnimatedCounter
  home/                       # Homepage sections
  layout/                     # Headers, navigation
  auth/                       # Auth forms
  academy/                    # Academy components
  community/                  # Community components
  forum/                      # Forum components
  dashboard/                  # Dashboard components
  subscriptions/              # Subscription/plan components
  commissions/                # Commission components
  ui/                         # Base UI primitives (Radix-based)
  a11y/                       # Accessibility components
  analytics/                  # Analytics components
  seo/                        # SEO components
  providers/                  # Context providers
lib/
  api/                        # API client functions
    client.ts                 # Axios instance with JWT interceptors
    schemas.ts                # Zod validation schemas
  hooks/                      # React Query hooks
  utils/                      # Utilities (cn, dateFormat)
  queryKeys.ts                # React Query key constants
  env.ts                      # Environment variable helpers
  errors.ts                   # Error handling utilities
messages/                     # i18n translation files (cs, sk, en, pl)
types/                        # TypeScript interfaces
mocks/                        # Mock data (specialists, locations, regions)
i18n/                         # next-intl configuration
backend/
  src/
    database/
      entities/               # TypeORM entities
      migrations/             # SQL migrations (timestamped)
      seeds/                  # Database seeding
      data-source.ts          # TypeORM DataSource config
      database.module.ts      # Database module
    specialists/              # Specialists module
    leads/                    # Leads module
    deals/                    # Deals/leads module
    commissions/              # Commissions module
    reviews/                  # Reviews module
    admin/                    # Admin module
    auth/                     # Authentication (JWT + Passport)
    crm/                      # CRM integration (mock)
    community/                # Events, RSVPs
    forum/                    # Forum (categories, topics, posts, likes)
    academy/                  # Academy (courses, modules, lessons, videos)
    email/                    # Resend email service
    cloudinary/               # Media uploads
    stripe/                   # Stripe payments
    subscriptions/            # Subscription management
    config/                   # Environment validation (class-validator)
    common/                   # Shared middleware, guards, decorators
    utils/                    # Backend utilities
```

## Key Patterns

### Database
- `synchronize: false` -- all schema changes via migrations only
- `migrationsRun: true` -- auto-run on app startup
- Migrations in `backend/src/database/migrations/`
- Compiled migrations loaded from `dist/database/migrations/*.js`
- Connection pool: max 20, min 5, idle timeout 30s, connect timeout 5s
- Production uses `DATABASE_URL` with SSL; local uses individual host/port/user/pass
- Generate migration: `npm run migration:generate -- src/database/migrations/MigrationName`
- Run migrations: `npm run migration:run`
- Revert migration: `npm run migration:revert`

### Entities
User, Specialist, Lead, Deal, LeadEvent, Review, ReviewToken, Subscription,
RefreshToken, Commission, Course, Module, Lesson, Video, Enrollment,
LessonProgress, Event, RSVP, ForumCategory, ForumTopic, ForumPost, ForumLike

### API
- Backend base URL: `NEXT_PUBLIC_API_URL` (production: `https://tvujspecialista-production.up.railway.app/api`)
- Local backend: `http://localhost:3001/api`
- Frontend API client: `lib/api/client.ts` (Axios with JWT interceptor + auto-refresh)
- React Query hooks in `lib/hooks/`
- Zod validation schemas in `lib/api/schemas.ts`
- Rate limiting: ThrottlerModule (60 requests per 60 seconds)
- Auto-retry on 429 and 503 responses

### Lead Pipeline
- 2 stages: NEW (blurred contacts) -> CONTACTED (visible, pushed to CRM)
- Contact masking: `maskContactIfNew()` in deals.service.ts
- CRM gate: mock push to OVB/Partner Group/4fin before contact reveal
- Urgency timer on NEW leads (declining success %)

### Authentication
- JWT-based (access token 15m + refresh token 7d)
- Passport.js with passport-jwt strategy
- Roles: user, specialist, admin
- Guards: JwtAuthGuard, RolesGuard
- Tokens stored in localStorage/sessionStorage on frontend
- Auto-redirect to `/profi/prihlaseni` on auth failure from dashboard pages

### Translations
- 4 locales: cs (Czech), sk (Slovak), en (English), pl (Polish)
- Files in `messages/{locale}.json`
- next-intl plugin configured via `i18n/request.ts`
- All UI strings must be translated in all 4 files

### Frontend Patterns
- Path alias: `@/*` maps to project root
- Tailwind CSS v4 with tailwind-merge and class-variance-authority
- Radix UI primitives for accessible components
- Framer Motion for animations
- React Hook Form + Zod for form validation
- @dnd-kit for drag-and-drop (Kanban board)
- next-themes for dark mode support
- Sentry error boundary integration
- Image optimization: Cloudinary remote patterns, AVIF + WebP formats

## Commands

### Frontend
```bash
npm run dev              # Start dev server (port 3000, webpack mode)
npm run build            # Production build (webpack mode)
npm run lint             # ESLint
npm run type-check       # TypeScript type check (tsc --noEmit)
npm run test             # Jest unit tests
npm run test:watch       # Jest in watch mode
npm run test:coverage    # Jest with coverage
npm run test:e2e         # Playwright end-to-end tests
npm run test:e2e:ui      # Playwright with UI
```

### Backend
```bash
cd backend
npm run start:dev                    # Start dev server (watch mode)
npm run start:debug                  # Start with debugger
npm run build                        # Build with NestJS CLI
npm run start:prod                   # Start production (node dist/main)
npm run migration:generate           # Generate migration from entity changes
npm run migration:run                # Run pending migrations
npm run migration:revert             # Revert last migration
npm run seed                         # Seed database
npm run test                         # Jest unit tests
npm run test:cov                     # Jest with coverage
npm run test:e2e                     # End-to-end tests
npm run lint                         # ESLint with auto-fix
npm run format                       # Prettier format
```

## Deployment

- **Frontend:** Auto-deploys from GitHub to Vercel (do NOT run `vercel --prod`)
- **Backend:** Auto-deploys from GitHub to Railway
- Push to `main` triggers both deploys
- Next.js uses `output: 'standalone'` for optimized Vercel deployment
- Console logs (except error/warn) are stripped in production builds

## Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL` -- Backend API URL
- `SENTRY_AUTH_TOKEN` -- Sentry source map upload (optional)

### Backend (Railway)
- `NODE_ENV` -- Environment (`development` | `production` | `test`)
- `PORT` -- Server port (default: 3001)
- `DATABASE_URL` -- PostgreSQL connection string (production)
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` -- Individual DB config (local dev)
- `JWT_SECRET` -- JWT signing secret
- `JWT_REFRESH_SECRET` -- Refresh token signing secret
- `JWT_EXPIRATION` -- Access token TTL (default: 15m)
- `JWT_REFRESH_EXPIRATION` -- Refresh token TTL (default: 7d)
- `FRONTEND_URL` -- Frontend URL for CORS and emails
- `RESEND_API_KEY` -- Resend email API key
- `RESEND_FROM_EMAIL` -- Sender email address
- `RESEND_FROM_NAME` -- Sender display name
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` -- Cloudinary credentials
- `CLOUDINARY_WEBHOOK_SECRET` -- Cloudinary webhook verification
- `STRIPE_SECRET_KEY` -- Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` -- Stripe webhook signing secret
- `STRIPE_BASIC_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, `STRIPE_PREMIUM_PRICE_ID` -- Stripe plan price IDs
- `STRIPE_EDUCATION_PRICE_ID`, `STRIPE_MARKETPLACE_PRICE_ID`, `STRIPE_PREMIUM_SUBSCRIPTION_PRICE_ID` -- Additional Stripe price IDs
- `SENTRY_DSN` -- Sentry error tracking DSN
