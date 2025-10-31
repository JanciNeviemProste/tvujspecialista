# Prompty pre Claude Code - tvujspecialista.cz

Tento dokument obsahuje pripravené prompty pre pokračovanie v projekte s Claude Code.

---

## 🎯 PROMPT #1 - Frontend MVP (✅ HOTOVO)

**Použité:** 31.01.2025
**Status:** Kompletné
**Model:** Claude Sonnet 4.5

```
Vytvor frontend MVP pre tvujspecialista.cz - marketplace pre finančných poradcov
a realitných maklérov v Česku a na Slovensku.

Tech stack:
- Next.js 16 s App Router a Turbopack
- TypeScript v strict mode
- TailwindCSS 4.x (nová syntax s @import "tailwindcss")
- React 19
- shadcn/ui komponenty (Button s Radix Slot)

Vytvor tieto stránky:

1. Homepage (/)
   - Hero sekcia s heading a popisom
   - 2 kategórie v kartách:
     * 💼 Finanční poradce - "Komplexní finanční poradenství - hypotéky, pojištění, investice a úvěry"
     * 🏠 Realitní makléř - "Prodej, pronájem a správa nemovitostí - byty, domy a komerční prostory"
   - Štatistiky (2500+ špecialistov, 15000+ zákazníkov, 98% úspešnosť)
   - CTA pre špecialistov

2. Vyhľadávanie (/hledat)
   - FilterPanel sidebar s:
     * Kategória (2 možnosti: Finanční poradce, Realitní makléř)
     * Lokalita (Praha, Brno, Ostrava, Plzeň)
     * Hodnotenie minimálne (5★, 4★, 3★)
     * Iba overení špecialisti (checkbox)
     * Cenové rozmedzie
   - Zoznam špecialistov (SpecialistCard komponenty)
   - Pagination

3. Detail špecialistu (/specialista/[slug])
   - Profilová sekcia (foto, meno, verified/top badge, rating)
   - O mne sekcia
   - Služby (zoznam so zaškrtnutiami)
   - Vzdelanie a certifikácie
   - Recenzie
   - Sidebar s kontaktným formulárom

4. Cenník (/ceny)
   - 3 tarify v kartách:
     * Basic: 300 Kč/mesiac - 10 leadov
     * Pro: 800 Kč/mesiac - 30 leadov (Najpopulárnejší)
     * Premium: 1500 Kč/mesiac - Neobmedzené leady
   - Porovnávacia tabuľka funkcií
   - FAQ sekcia

5. O nás (/o-nas)
   - Naša misia
   - Prečo sme vznikli
   - Čo ponúkame (pre zákazníkov / pre špecialistov)
   - Naše hodnoty
   - CTA tlačidlá

6. Kontakt (/kontakt)
   - Kontaktný formulár (meno, email, telefón, predmet, správa)
   - Kontaktné údaje (email, telefón, adresa)
   - Rýchle odkazy
   - Sociálne siete

7. Právne stránky
   - /pravidla - Obchodní podmínky
   - /ochrana-osobnich-udaju - GDPR compliance

8. Provider sekcia:
   - /profi/prihlaseni - Login formulár
   - /profi/registrace - Registračný formulár (osobné údaje, profesné info, heslo)
   - /profi/dashboard - Dashboard so štatistikami, leadmi, quick actions

Komponenty:
- Button (components/ui/button.tsx) - s asChild prop pre Radix Slot
- RatingStars (components/shared/RatingStars.tsx) - zobrazenie hviezd s half-star support
- SpecialistCard (components/shared/SpecialistCard.tsx) - karta špecialistu

TypeScript typy (types/):
- specialist.ts: SpecialistCategory = 'Finanční poradce' | 'Realitní makléř'
- review.ts, lead.ts, user.ts

Mock data (mocks/specialists.ts):
- 9 špecialistov s realistickými českými menami
- 7 finančných poradcov (Jan Novák, Petra Svobodová, Martin Dvořák,
  Kateřina Malá, Jan Král, Pavel Horák, + 1)
- 2 realitní makléři (Lucie Novotná, Michaela Veselá)
- Lokality: Praha, Brno, Ostrava
- Realistic bio, services, certifications, education

Design:
- Farby: Primary blue (#0ea5e9), verified green, top gold
- Clean, professional, modern
- Mobile-first responsive
- Žiadne emoji (okrem homepage kategórií)

Dôležité:
- Server Components ONLY - žiadne onClick, onChange, onError handlery
- Použiť <a> tagy namiesto Next.js Link
- TailwindCSS 4.x syntax: @import "tailwindcss" v globals.css
- darkMode: "class" (nie ["class"])
- Žiadne onError handlery na img tagoch (spôsobujú build errors)

Deployment:
- GitHub: https://github.com/JanciNeviemProste/tvujspecialista
- Vercel: automatický deployment pri push
- Root directory: frontend/

Po dokončení:
- Commit s message: "feat: Initial frontend MVP"
- Push na GitHub
```

---

## 🔜 PROMPT #2 - Backend API (ĎALŠÍ KROK)

**Použiť:** Po dokončení frontendu
**Model:** Claude Sonnet 4.5 / Opus 4.1

```
Vytvor NestJS backend API pre tvujspecialista.cz marketplace.

Projekt:
- Existujúci Next.js 16 frontend v /frontend
- Backend bude v /backend
- Frontend kategórie: 'Finanční poradce' | 'Realitní makléř'

Tech stack:
- NestJS (latest stable)
- TypeORM + PostgreSQL 15+
- JWT autentizácia (Access + Refresh tokens)
- bcrypt pre hashovanie hesiel
- class-validator, class-transformer
- @nestjs/swagger pre API dokumentáciu

Databáza schéma:

1. users table:
   - id (uuid, PK)
   - email (unique, not null)
   - password (hashed, not null)
   - role (enum: customer, specialist, admin)
   - emailVerified (boolean, default false)
   - createdAt, updatedAt

2. specialists table:
   - id (uuid, PK)
   - userId (FK to users)
   - slug (unique, indexed)
   - name, phone, photo
   - verified (boolean, default false)
   - topSpecialist (boolean, default false)
   - category (enum: 'Finanční poradce', 'Realitní makléř')
   - location, bio
   - yearsExperience, hourlyRate
   - rating (decimal 3,2), reviewsCount
   - services (array), certifications (array)
   - education, website, linkedin
   - availability (array)
   - subscriptionTier (enum: basic, pro, premium)
   - createdAt, updatedAt

3. leads table:
   - id (uuid, PK)
   - specialistId (FK to specialists)
   - customerName, customerEmail, customerPhone
   - message (text)
   - status (enum: new, contacted, scheduled, closed, rejected)
   - createdAt, updatedAt

4. reviews table:
   - id (uuid, PK)
   - specialistId (FK to specialists)
   - customerName
   - rating (1-5)
   - text
   - verified (boolean)
   - createdAt, updatedAt

5. subscriptions table:
   - id (uuid, PK)
   - specialistId (FK to specialists)
   - tier (enum: basic, pro, premium)
   - startDate, endDate
   - status (enum: active, expired, cancelled)
   - paymentProvider (stripe/gopay)
   - paymentId
   - createdAt, updatedAt

API Endpoints:

PUBLIC (bez autentizácie):
GET    /api/specialists
  - Query params: category, location, minRating, maxPrice, verified, page, limit
  - Response: { specialists: [], total, page, limit, hasMore }

GET    /api/specialists/:slug
  - Response: Kompletný profil + recenzie

POST   /api/leads
  - Body: { specialistId, customerName, customerEmail, customerPhone, message }
  - Response: Created lead
  - Trigger: Email notifikácia špecialistovi

GET    /api/reviews/:specialistId
  - Query params: page, limit
  - Response: Zoznam recenzií

AUTH ENDPOINTS:
POST   /api/auth/register
  - Body: { email, password, name, phone, category, location, bio, ... }
  - Vytvorí User + Specialist
  - Vráti JWT tokens + user data

POST   /api/auth/login
  - Body: { email, password }
  - Vráti JWT tokens + user data

POST   /api/auth/refresh
  - Header: refresh token
  - Vráti nový access token

GET    /api/auth/me
  - Header: Bearer token
  - Vráti user + specialist data

SPECIALIST ENDPOINTS (autentizované):
GET    /api/specialists/me
PATCH  /api/specialists/me
  - Body: Partial<Specialist>

POST   /api/specialists/me/photo
  - Multipart form data
  - Upload do Cloudinary/S3
  - Update photo URL v DB

GET    /api/leads/my
  - Query params: status, page, limit
  - Response: Moje leady

PATCH  /api/leads/:id/status
  - Body: { status }
  - Update lead status

GET    /api/reviews/my
  - Moje recenzie

ADMIN ENDPOINTS:
GET    /api/admin/users
PATCH  /api/admin/specialists/:id/verify
  - Body: { verified: true/false }

Funkcionalita:

1. JWT stratégia
   - Access token (15 min expiry)
   - Refresh token (7 dní expiry)
   - HttpOnly cookies

2. Email služba (SendGrid/Mailgun)
   - Welcome email po registrácii
   - Email verifikácia
   - Notifikácia o novom leade
   - Reset hesla

3. File upload
   - Cloudinary/AWS S3 integrácia
   - Image resize a optimalizácia
   - Max 5MB, PNG/JPG/WEBP

4. Rate limiting
   - 100 req/15min pre verejné endpointy
   - 1000 req/15min pre autentizované

5. Validation pipes
   - class-validator decorators
   - DTOs pre všetky endpointy

6. Error handling
   - Global exception filter
   - Štandardizované error responses

7. Swagger dokumentácia
   - /api/docs endpoint
   - Všetky endpointy dokumentované

8. CORS
   - Allow origin: https://tvujspecialista.vercel.app
   - Credentials: true

Environment variables (.env):
DATABASE_URL=postgresql://user:password@localhost:5432/tvujspecialista
JWT_SECRET=generate-strong-secret
JWT_REFRESH_SECRET=generate-strong-secret
SENDGRID_API_KEY=your-sendgrid-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://tvujspecialista.vercel.app

Po vytvorení:
1. Seed DB s mock dátami z frontendu (9 špecialistov)
2. Test endpointy v Postmanu
3. Deploy na Railway/Render
4. Update frontend API_URL
```

---

## 🔜 PROMPT #3 - Frontend x Backend integrácia

**Použiť:** Po dokončení backendu
**Model:** Claude Sonnet 4.5

```
Prepoj Next.js frontend s NestJS backendom pre tvujspecialista.cz.

Existujúci stav:
- Frontend: Next.js 16 v /frontend s mock dátami
- Backend: NestJS API v /backend na http://localhost:3001

Úlohy:

1. API Client setup (frontend/lib/api/)
   - axios instance s baseURL
   - Interceptors pre JWT tokens
   - Error handling
   - Type-safe API functions

Vytvor:
- lib/api/client.ts - axios konfigurácia
- lib/api/specialists.ts - getSpecialists(), getSpecialistBySlug()
- lib/api/leads.ts - createLead()
- lib/api/reviews.ts - getReviews()
- lib/api/auth.ts - register(), login(), refreshToken()

2. React Query setup
   - QueryClient konfigurácia
   - Hooks pre fetching:
     * useSpecialists(filters)
     * useSpecialist(slug)
     * useReviews(specialistId)
     * useCreateLead()
   - Optimistic updates
   - Cache invalidation

3. Auth Context
   - AuthProvider s React Context
   - useAuth() hook
   - Login/logout funkcionalita
   - Token management (localStorage/cookies)
   - Auto refresh tokens

4. Nahradiť mock dáta
   - app/page.tsx - fetch real categories count
   - app/hledat/page.tsx - useSpecialists() namiesto mockSpecialists
   - app/specialista/[slug]/page.tsx - useSpecialist(slug)
   - app/profi/dashboard/page.tsx - fetch real leads

5. Formuláre
   - Contact form na detail page - createLead mutation
   - Registration form - register mutation
   - Login form - login mutation
   - Error handling a validácia

6. Environment variables
   - NEXT_PUBLIC_API_URL=http://localhost:3001
   - Pre produkciu: https://api.tvujspecialista.cz

7. Error handling
   - Error boundary komponenty
   - Toast notifikácie (sonner/react-hot-toast)
   - Retry logic pre failed requests

8. Loading states
   - Skeleton components
   - Suspense boundaries
   - Loading spinners

Dôležité:
- Server Components majú priamy prístup k API (fetch v RSC)
- Client Components používajú React Query hooks
- Optimistic UI updates pre lepší UX
- Type safety - zdieľať typy medzi FE a BE

Po dokončení:
- Otestovať všetky flows
- Update README s API docs
- Commit: "feat: Integrate frontend with backend API"
```

---

## 🔜 PROMPT #4 - Payment Integration (Stripe)

**Použiť:** Po API integrácii
**Model:** Claude Sonnet 4.5 / Opus 4.1

```
Implementuj Stripe payment processing pre tvujspecialista.cz subscriptions.

Existujúci backend: NestJS v /backend
Tarify:
- Basic: 300 Kč/mesiac (€12) - 10 leadov
- Pro: 800 Kč/mesiac (€32) - 30 leadov
- Premium: 1500 Kč/mesiac (€60) - neobmedzené leady

Backend úlohy:

1. Stripe module (backend/src/payments/)
   - @nestjs/stripe integrácia
   - StripeService s metodami:
     * createCheckoutSession(specialistId, tier)
     * createPortalSession(specialistId)
     * handleWebhook(event)

2. Stripe Products a Prices
   - Vytvor 3 produkty v Stripe Dashboard
   - Recurring monthly subscriptions
   - CZK mena
   - Metadata: tier, leadLimit

3. Webhook handling
   - POST /api/payments/webhook
   - Verify Stripe signature
   - Handle events:
     * checkout.session.completed - aktivovať subscription
     * customer.subscription.updated - update tier
     * customer.subscription.deleted - deaktivovať subscription
     * invoice.payment_succeeded - predĺžiť subscription
     * invoice.payment_failed - upozorniť usera

4. Subscription endpoints
   - POST /api/payments/checkout - create Stripe Checkout session
   - POST /api/payments/portal - customer portal link
   - GET /api/payments/subscription - current subscription info

5. Lead counting
   - Middleware check pre lead limit
   - Increment leadCount pri novom leade
   - Reset count monthly (cron job)

Frontend úlohy:

1. Pricing page upgrade
   - "Vybrat tarif" buttons
   - Redirect to Stripe Checkout
   - Success/cancel return URLs

2. Dashboard subscription status
   - Display current tier
   - Remaining leads count
   - Upgrade/downgrade buttons
   - "Spravovat platby" → Stripe Portal

3. Stripe.js integrácia
   - @stripe/stripe-js package
   - Elements provider (ak custom checkout)

Environment variables:
Backend:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

Frontend:
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

Testing:
- Use Stripe test cards
- Test webhooks s Stripe CLI
- Test subscription lifecycle

Po dokončení:
- Test celý payment flow
- Setup produkčné Stripe keys
- Commit: "feat: Add Stripe subscription payments"
```

---

## 🔜 PROMPT #5 - Real-time Features (WebSockets)

**Použiť:** Po payments
**Model:** Claude Sonnet 4.5

```
Pridaj real-time notifikácie a messaging pre tvujspecialista.cz.

Backend setup (NestJS + Socket.io):

1. WebSocket Gateway (backend/src/websockets/)
   - @nestjs/websockets, socket.io
   - JWT autentizácia pre WS connections
   - Rooms: specialist-{id}, admin

2. Events:
   - new_lead - emit to specialist room pri novom leade
   - lead_status_changed - emit to customer
   - new_message - messaging medzi zákazníkom a špecialistom
   - online_status - track online specialists

3. Notifications table
   - id, userId, type, title, message, read, createdAt

Frontend setup:

1. Socket client (frontend/lib/socket/)
   - socket.io-client
   - useSocket() hook
   - Auto reconnect logic

2. Notifications komponenty
   - NotificationBell v headeri
   - Unread count badge
   - Dropdown s posledných 5 notifikácií
   - "Mark as read" functionality

3. Dashboard live updates
   - Real-time new leads bez refresh
   - Toast notifikácia + sound
   - Lead status changes live

4. Messaging (optional)
   - Chat komponenta
   - Message history
   - Typing indicators
   - Read receipts

Po dokončení:
- Test real-time updates
- Commit: "feat: Add real-time notifications with WebSockets"
```

---

## 🔮 PROMPT #6 - SEO Optimalizácia

**Použiť:** Pred produkčným launch
**Model:** Claude Sonnet 4.5

```
Implementuj kompletné SEO pre tvujspecialista.cz.

Úlohy:

1. Meta tags pre každú stránku
   - Dynamic title a description
   - Canonical URLs
   - robots meta tag

2. Structured Data (JSON-LD)
   - LocalBusiness schema pre špecialistov
   - Review schema
   - BreadcrumbList
   - Organization schema pre homepage

3. sitemap.xml
   - Dynamický sitemap z API
   - /sitemap.xml endpoint
   - Všetky specialist pages
   - Static pages

4. robots.txt
   - Allow všetky verejné stránky
   - Disallow admin, dashboard

5. Open Graph tags
   - og:image (generate pre každého špecialistu)
   - og:title, og:description
   - Twitter Cards

6. Image optimization
   - next/image všade
   - WebP format
   - Lazy loading
   - Blur placeholder

7. Performance
   - Lighthouse score 90+
   - Core Web Vitals optimization
   - Code splitting
   - Font optimization

Po dokončení:
- Test s Lighthouse
- Google Search Console setup
- Commit: "feat: Complete SEO optimization"
```

---

## 🔮 PROMPT #7 - i18n (Czech/Slovak)

**Použiť:** Voliteľné
**Model:** Claude Sonnet 4.5

```
Pridaj český a slovenský jazyk pre tvujspecialista.cz.

Setup:
- next-intl package
- /cs/ a /sk/ route prefixes
- Language switcher v headeri

Translations:
1. Vytvor translations súbory:
   - messages/cs.json
   - messages/sk.json

2. Preložiť:
   - Všetky UI texty
   - Form labels a validácie
   - Email templates
   - Meta descriptions

3. Localized content:
   - Kategórie v oboch jazykoch
   - Lokality (Prague/Praha, Bratislava)
   - Cenník (Kč pre CS, € pre SK)

4. URL slugs:
   - /cs/hledat vs /sk/hladať
   - /cs/specialista vs /sk/specialista

Dôležité:
- Default jazyk: Czech
- Locale detection z browser
- Persist jazyk v cookie

Po dokončení:
- Commit: "feat: Add Czech and Slovak localization"
```

---

## 💡 Tipy pre používanie promptov

1. **Kópíruj celý prompt** do Claude Code
2. **Čítaj DEVELOPMENT_LOG.md** pred použitím promptu
3. **Skontroluj dependencies** - nainštalované packages
4. **Environment variables** - nastav pred použitím
5. **Git commit** po každej väčšej zmene
6. **Test manuálne** pred commitom

## 📋 Checklist pred použitím promptu

- [ ] Prečítal som DEVELOPMENT_LOG.md
- [ ] Prečítal som README.md
- [ ] Mám nainštalované dependencies
- [ ] Environment variables sú nastavené
- [ ] Git je clean (nie uncommitted changes)
- [ ] Viem, čo prompt robí

---

**Posledná aktualizácia:** 31.01.2025
