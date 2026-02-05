# Development Log - tvujspecialista.cz

## Prehľad projektu

**Názov:** tvujspecialista.cz
**Typ:** Marketplace pre finančných poradcov a realitných maklérov (CZ/SK)
**Tech stack:** Next.js 16, TypeScript, TailwindCSS 4.x, React 19
**Deployment:** Vercel (https://tvujspecialista.vercel.app)
**GitHub:** https://github.com/JanciNeviemProste/tvujspecialista

## Aktuálny stav (31.01.2025)

### ✅ Fáza 1 - Frontend MVP (100% HOTOVO)

#### Infraštruktúra
- [x] Next.js 16 projekt s TypeScript a Turbopack
- [x] TailwindCSS 4.x konfigurácia (nová syntax s `@import`)
- [x] Základné UI komponenty (Button, RatingStars, SpecialistCard)
- [x] TypeScript typy pre všetky entity
- [x] Mock data (9 špecialistov)
- [x] **Kategórie zjednodušené na 2 typy:**
  - **Finanční poradce** - hypotéky, pojištění, investice, úvěry
  - **Realitní makléř** - prodej, pronájem, správa nemovitostí

#### Verejné stránky
- [x] Homepage (/) - Hero, 2 kategórie, štatistiky, CTA
- [x] Vyhľadávanie (/hledat) - Filtre, zoznam špecialistov
- [x] Detail špecialistu (/specialista/[slug])
- [x] Cenník (/ceny) - 3 tarify
- [x] O nás (/o-nas)
- [x] Kontakt (/kontakt)
- [x] Právne stránky (/pravidla, /ochrana-osobnich-udaju)

#### Provider sekcia
- [x] Prihlásenie (/profi/prihlaseni)
- [x] Registrácia (/profi/registrace)
- [x] Dashboard (/profi/dashboard)

## Posledné zmeny (31.01.2025)

### Refactor: Zjednodušenie kategórií na 2 typy

**Commit:** `6192e53` - "refactor: Simplify categories to 2 types"

**Zmenené súbory:**
1. `types/specialist.ts` - Pridaný `SpecialistCategory` union type
2. `mocks/specialists.ts` - Reklasifikovaných 9 špecialistov (odstránené 2 účtovníci)
3. `app/page.tsx` - Homepage s 2 veľkými kartami kategórií
4. `app/hledat/page.tsx` - Filter s 2 možnosťami
5. `app/profi/registrace/page.tsx` - Dropdown s 2 kategóriami
6. `app/specialista/[slug]/page.tsx` - Aktualizované mock data
7. `README.md` - Dokumentácia zmien

**Dôležité:**
- TypeScript typ `category` je teraz `'Finanční poradce' | 'Realitní makléř'`
- URL slugy aktualizované: `/hledat?category=financni-poradce`
- Špecialistov slugy: `jan-novak-financni-poradce-praha`

## Známe problémy

### 1. Turbopack Path Issue
**Problém:** Build zlyháva s chybou "path contains invalid UTF-8 character" pri českých znakoch v ceste.

**Riešenie:**
- Lokálne: `npm run dev` funguje normálne
- Produkcia: Vercel build environment nemá tento problém

### 2. Server Components vs Client Components
**Problém:** Next.js 16 je veľmi striktný ohľadom Server/Client Components.

**Riešenie:**
- Všetky event handlery (`onClick`, `onChange`, `onError`) vyžadujú `'use client'` direktívu
- Aktuálne používame pure Server Components s HTML + Tailwind
- **Odstránené všetky `onError` handlery z `<img>` tagov** - spôsobovali build errors

### 3. TailwindCSS 4.x syntax
- `darkMode: "class"` namiesto `darkMode: ["class"]`
- `@import "tailwindcss"` namiesto `@tailwind` direktív

## Technické detaily

### Štruktúra projektu
```
frontend/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Homepage
│   ├── hledat/                # Vyhľadávanie
│   ├── specialista/[slug]/    # Detail špecialistu
│   ├── ceny/                  # Cenník
│   ├── o-nas/                 # O nás
│   ├── kontakt/               # Kontakt
│   ├── pravidla/              # Obchodné podmienky
│   ├── ochrana-osobnich-udaju/ # GDPR
│   └── profi/                 # Provider sekcia
│       ├── prihlaseni/
│       ├── registrace/
│       └── dashboard/
├── components/
│   ├── ui/                    # Button (s Radix Slot)
│   └── shared/                # RatingStars, SpecialistCard
├── types/                     # TypeScript definície
├── mocks/                     # Mock data
├── styles/                    # Global CSS
└── README.md
```

### Mock dáta - 9 špecialistov

**Finanční poradce (7):**
1. Jan Novák (Praha) - Top, Premium, 4.9★, 10 rokov
2. Petra Svobodová (Brno) - Pro, 4.8★, 8 rokov
3. Martin Dvořák (Praha) - Top, Premium, 4.9★, 12 rokov
4. Kateřina Malá (Brno) - Basic, 4.6★, 4 roky
5. Jan Král (Praha) - Top, Premium, 4.8★, 20 rokov
6. Pavel Horák (Brno) - Basic, 4.7★, 5 rokov

**Realitní makléř (2):**
7. Lucie Novotná (Ostrava) - Pro, 4.7★, 6 rokov
8. Michaela Veselá (Praha) - Pro, 4.9★, 7 rokov

### Kategórie špecialistov

```typescript
export type SpecialistCategory = 'Finanční poradce' | 'Realitní makléř'
```

**Finanční poradce** pokrýva:
- Hypotéky a refinancování
- Životní a podnikatelské pojištění
- Investiční strategie a portfolio management
- Úvěry a finanční plánování

**Realitní makléř** pokrýva:
- Prodej bytů a domů
- Pronájem nemovitostí
- Správa nemovitostí
- Odhad tržní ceny

## 🚧 Fáza 2 - Backend (PRIORITA)

### Co treba spraviť

#### 1. NestJS Backend Setup
```bash
cd backend
npm init -y
npm install @nestjs/core @nestjs/common @nestjs/platform-express
npm install @nestjs/typeorm typeorm pg
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt class-validator class-transformer
```

**Štruktúra:**
```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── specialists/
│   │   ├── specialists.module.ts
│   │   ├── specialists.controller.ts
│   │   ├── specialists.service.ts
│   │   └── specialist.entity.ts
│   ├── leads/
│   │   ├── leads.module.ts
│   │   ├── leads.controller.ts
│   │   ├── leads.service.ts
│   │   └── lead.entity.ts
│   ├── reviews/
│   ├── auth/
│   ├── users/
│   └── payments/
└── package.json
```

#### 2. PostgreSQL databáza

**Tabuľky:**
- `users` - Používatelia (zákazníci + špecialisti)
- `specialists` - Profily špecialistov
- `leads` - Poptávky zákazníkov
- `reviews` - Recenzie
- `subscriptions` - Platby/predplatné
- `messages` - Správy medzi zákazníkmi a špecialistami

**Entity pre Specialist:**
```typescript
@Entity('specialists')
export class Specialist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ default: false })
  topSpecialist: boolean;

  @Column({
    type: 'enum',
    enum: ['Finanční poradce', 'Realitní makléř']
  })
  category: 'Finanční poradce' | 'Realitní makléř';

  @Column()
  location: string;

  @Column('text')
  bio: string;

  @Column('int')
  yearsExperience: number;

  @Column('int', { default: 0 })
  hourlyRate: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviewsCount: number;

  @Column('simple-array')
  services: string[];

  @Column('simple-array')
  certifications: string[];

  @Column()
  education: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column('simple-array')
  availability: string[];

  @Column({
    type: 'enum',
    enum: ['basic', 'pro', 'premium'],
    default: 'basic'
  })
  subscriptionTier: 'basic' | 'pro' | 'premium';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### 3. API Endpoints

**Verejné (bez autentizácie):**
```
GET    /api/specialists           - Zoznam špecialistov s filtrami
GET    /api/specialists/:slug     - Detail špecialistu
GET    /api/reviews/:specialistId - Recenzie špecialistu
POST   /api/leads                 - Vytvorenie poptávky (lead)
```

**Autentizované (pre špecialistov):**
```
POST   /api/auth/register         - Registrácia
POST   /api/auth/login            - Prihlásenie
POST   /api/auth/refresh          - Refresh token
GET    /api/auth/me               - Aktuálny používateľ

GET    /api/specialists/me        - Môj profil
PATCH  /api/specialists/me        - Upraviť profil
POST   /api/specialists/me/photo  - Upload fotky

GET    /api/leads/my              - Moje leady
PATCH  /api/leads/:id/status      - Zmena stavu leadu

GET    /api/reviews/my            - Moje recenzie
```

**Admin endpoints:**
```
GET    /api/admin/users           - Zoznam používateľov
PATCH  /api/admin/specialists/:id/verify - Overiť špecialistu
```

#### 4. Autentizácia (JWT)

**Stratégia:**
- Access token (15 min)
- Refresh token (7 dní)
- HttpOnly cookies pre tokeny

**Register flow:**
1. Validácia dát (email, telefón, IČO)
2. Hash hesla (bcrypt)
3. Vytvorenie User + Specialist entity
4. Email verifikácia (optional)
5. Vrátenie JWT tokenov

**Login flow:**
1. Overenie emailu a hesla
2. Vytvorenie JWT tokenov
3. Vrátenie tokenov + user data

#### 5. Email služba (SendGrid/Mailgun)

**Typy emailov:**
- Vítací email po registrácii
- Email verifikácia
- Notifikácia o novom leade
- Potvrdenie kontaktu zákazníkovi
- Reset hesla

#### 6. Payment processing (Stripe/GoPay)

**Tarify:**
- Basic: 300 Kč/mesiac - 10 leadov
- Pro: 800 Kč/mesiac - 30 leadov
- Premium: 1500 Kč/mesiac - neobmedzené leady

**Integrácia:**
- Stripe Checkout/Payment Intents
- Webhooks pre payment confirmation
- Subscription management

#### 7. Admin panel

**Funkcie:**
- Zoznam všetkých používateľov
- Overovanie špecialistov (verified badge)
- Správa leadov a recenzií
- Štatistiky (počet používateľov, leadov, revenue)
- Moderácia obsahu

## 🎯 Fáza 3 - Pokročilé frontend funkcie

### 1. 7-step Registration Wizard
Aktuálne je jednoduchý formulár. Rozšíriť na:
1. Základné info (meno, email, telefón)
2. Profesné info (kategória, lokalita, roky praxe)
3. Bio a služby
4. Certifikácie a vzdelanie
5. Upload fotky
6. Nastavenie hesla
7. Výber tarify

### 2. Provider CRM Dashboard
- Správa leadov (nový, kontaktovaný, dohodnutý, uzavretý, zamietnutý)
- Kalendár stretnutí
- Štatistiky (conversion rate, response time)
- Notifikácie

### 3. Real-time notifikácie
- WebSockets (Socket.io)
- Push notifikácie pre nové leady
- Email + push kombinácia

### 4. i18n (Internacionalizácia)
- Czech/Slovak prepínanie
- next-intl alebo react-i18next
- Lokalizované URL slugy

### 5. SEO optimalizácia
- Meta tagy pre každú stránku
- Structured data (JSON-LD) pre špecialistov
- Sitemap.xml
- robots.txt
- Open Graph a Twitter Cards

### 6. Performance optimalizácia
- Image optimization (next/image)
- Code splitting
- Lazy loading komponentov
- React Query pre caching

### 7. CookieBanner (TCF 2.2)
- GDPR compliance
- Consent management
- Google Analytics integrácia

## Prompty pre Claude Code

### Prompt #1 - Frontend MVP (HOTOVO ✅)
```
Vytvor frontend MVP pre tvujspecialista.cz - marketplace pre finančných
poradcov a realitných maklérov v CZ/SK.

Tech stack:
- Next.js 16 (App Router, Turbopack)
- TypeScript (strict mode)
- TailwindCSS 4.x
- React 19

Funkcionalita:
1. Homepage - hero, 2 kategórie, štatistiky, CTA
2. Vyhľadávanie špecialistov - filtre (kategória, lokalita, rating, cena)
3. Detail špecialistu - profil, služby, recenzie, kontaktný formulár
4. Cenník - 3 tarify (Basic, Pro, Premium)
5. O nás, Kontakt, Právne stránky
6. Provider sekcia:
   - Prihlásenie
   - Registrácia
   - Dashboard (štatistiky, leady, quick actions)

Kategórie:
- Finanční poradce (hypotéky, pojištění, investice)
- Realitní makléř (prodej, pronájem nemovitostí)

Mock data:
- 9 špecialistov (7 finančných poradcov, 2 realitní makléři)
- Realistic české/slovenské mená a lokality
- Reviews s verified badges

Design:
- Modern, clean, professional
- Blue color scheme (#0ea5e9)
- Mobile-first responsive
- Server Components only (bez event handlers)

Deployment:
- GitHub: https://github.com/JanciNeviemProste/tvujspecialista
- Vercel: automatický deployment
```

### Prompt #2 - Backend API (ĎALŠÍ KROK 🔜)
```
Vytvor NestJS backend API pre tvujspecialista.cz marketplace.

Tech stack:
- NestJS (latest)
- TypeORM + PostgreSQL
- JWT autentizácia (Access + Refresh tokens)
- bcrypt pre hashovanie hesiel
- class-validator pre validáciu

Databáza:
- PostgreSQL 15+
- Tabuľky: users, specialists, leads, reviews, subscriptions, messages

Entities:
1. User (email, password, role: customer/specialist/admin)
2. Specialist (profil data, kategória, rating, subscription tier)
3. Lead (poptávka zákazníka, status, timestamps)
4. Review (hodnotenie, text, verified)
5. Subscription (tier, expiry, payment status)

API Endpoints:
Verejné:
- GET /api/specialists - zoznam s filtrami (kategória, lokalita, rating)
- GET /api/specialists/:slug - detail
- POST /api/leads - vytvorenie poptávky
- GET /api/reviews/:specialistId - recenzie

Autentizované (specialists):
- POST /api/auth/register
- POST /api/auth/login
- GET /api/specialists/me
- PATCH /api/specialists/me
- GET /api/leads/my
- PATCH /api/leads/:id/status

Admin:
- GET /api/admin/users
- PATCH /api/admin/specialists/:id/verify

Funkcie:
- JWT stratégia s refresh tokens
- Email verifikácia pri registrácii
- Upload profilových fotiek (AWS S3/Cloudinary)
- Rate limiting
- CORS pre frontend domain
- Swagger dokumentácia

Integrácie:
- SendGrid/Mailgun - email notifikácie
- Stripe/GoPay - platby
- Cloudinary - image hosting
```

### Prompt #3 - Real-time Features (FÁZA 3 🔮)
```
Pridaj real-time funkcie do tvujspecialista.cz:

1. WebSocket server (Socket.io)
   - Real-time notifikácie pre nových leadov
   - Online status špecialistov
   - Unread count pre správy

2. Chat systém
   - Messaging medzi zákazníkmi a špecialistami
   - Read receipts
   - Typing indicators
   - File uploads (dokumenty, obrázky)

3. Push notifikácie
   - Browser push API
   - Notifications pre nové leady, správy, reviews
   - Preference management

4. Dashboard updates
   - Live štatistiky
   - Real-time lead status changes
   - Calendar events synchronizácia
```

### Prompt #4 - i18n a SEO (FÁZA 3 🔮)
```
Implementuj i18n a SEO pre tvujspecialista.cz:

1. Internacionalizácia (next-intl)
   - Czech a Slovak lokalizácie
   - Language switcher v headeri
   - Lokalizované URL slugy (/cs/, /sk/)
   - Translations pre všetky texty

2. SEO optimalizácia
   - Dynamic meta tags (title, description) pre každú stránku
   - Structured data (JSON-LD) pre:
     - LocalBusiness pre špecialistov
     - Review schema pre recenzie
     - BreadcrumbList pre navigáciu
   - sitemap.xml (dynamický z API)
   - robots.txt
   - Canonical URLs
   - Open Graph tags
   - Twitter Cards

3. Performance
   - Image optimization (next/image)
   - Lazy loading
   - Code splitting
   - ISR (Incremental Static Regeneration) pre specialist pages
```

## Užitočné príkazy

### Development
```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run type-check   # TypeScript check

# Backend (po vytvorení)
cd backend
npm install
npm run start:dev    # development mode
npm run start:prod   # production mode
npm run migration:generate -- MigrationName
npm run migration:run
```

### Git workflow
```bash
git add .
git commit -m "feat: description"
git push origin main
```

### Vercel deployment
- Automatický deployment pri push na main
- Vercel dashboard: https://vercel.com/dashboard
- Preview deployments pre PR

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_SITE_URL=https://tvujspecialista.vercel.app
NEXT_PUBLIC_API_URL=https://api.tvujspecialista.cz
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tvujspecialista
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
SENDGRID_API_KEY=your-sendgrid-key
STRIPE_SECRET_KEY=your-stripe-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Kontakty a odkazy

- **Live site:** https://tvujspecialista.vercel.app
- **GitHub:** https://github.com/JanciNeviemProste/tvujspecialista
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentation:** README.md v root a frontend/

## Poznámky pre budúci development

### Priority
1. ✅ Frontend MVP - HOTOVO
2. 🔜 Backend API - NestJS + PostgreSQL + JWT auth
3. 🔜 Email služba - SendGrid integrácia
4. 🔜 Payment processing - Stripe/GoPay
5. 🔜 Admin panel
6. 🔜 i18n (CS/SK)
7. 🔜 SEO optimalizácia

### Dôležité rozhodnutia
- **Kategórie:** 2 typy (Finanční poradce, Realitní makléř)
- **Server Components only:** Žiadne event handlers v Server Components
- **TailwindCSS 4.x:** Nová syntax s `@import`
- **Mock data:** 9 špecialistov s realistickými českými dátami
- **No emoji:** Nepoužívať emoji v kóde (okrem homepage kategórií)

### Ak pokračuješ v projekte
1. Prečítaj si tento dokument celý
2. Skontroluj README.md v `frontend/`
3. Pozri si `types/specialist.ts` pre TypeScript typy
4. Mock data sú v `mocks/specialists.ts`
5. Build errors riešiť podľa sekcie "Známe problémy"

---

**Posledná aktualizácia:** 31.01.2025
**Autor:** Claude Code (Sonnet 4.5)
**Status:** Fáza 1 (Frontend MVP) hotová, pripravené na Fázu 2 (Backend)
