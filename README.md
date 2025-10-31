# tvujspecialista.cz - Frontend

Marketplace pro hledání ověřených specialistů v oblasti financí a nemovitostí v ČR a SK.

## 🚀 Rychlý start

```bash
# Instalace závislostí
npm install

# Spuštění dev serveru
npm run dev

# Build pro produkci
npm run build

# Spuštění produkční verze
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

Aplikace běží na `http://localhost:3000`

## 📁 Struktura projektu

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── hledat/              # Vyhledávání specialistů
│   ├── specialista/[slug]/  # Detail specialisty
│   ├── profi/               # Provider section
│   │   ├── registrace/      # 7-step registration wizard
│   │   ├── prihlaseni/      # Login
│   │   └── dashboard/       # CRM dashboard
│   ├── ceny/                # Pricing page
│   └── ...                  # Legal & other pages
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Header, Footer
│   ├── search/              # Search & filters
│   ├── cards/               # Card components
│   ├── forms/               # Form components
│   ├── dashboard/           # Dashboard components
│   ├── shared/              # Shared components
│   └── providers/           # Context providers
├── lib/
│   ├── api/                 # API functions (mocked)
│   ├── hooks/               # React Query hooks
│   └── utils/               # Utility functions
├── mocks/                   # Mock data
├── types/                   # TypeScript types
├── locales/                 # i18n translations
└── styles/                  # Global styles
```

## 🎯 Implementované funkce (MVP)

### ✅ Hotovo

**Základní infrastruktura:**
- ✅ Next.js 16 projekt s TypeScript a Turbopack
- ✅ TailwindCSS 4.x konfigurace
- ✅ Základní UI komponenty (Button s Radix Slot, RatingStars, SpecialistCard)
- ✅ TypeScript typy pro všechny entity (Specialist, Review, Lead, User)
- ✅ Mock data (9 specialistů: 7 finančních poradců, 2 realitní makléři)
- ✅ **Kategorie zjednodušeny na 2 typy:** Finanční poradce (hypotéky, pojištění, investice) a Realitní makléř
- ✅ Responsive design struktura (Mobile-first)

**Veřejné stránky:**
- ✅ Homepage (/) - Hero, 2 kategorie (Finanční poradce, Realitní makléř), statistiky, CTA
- ✅ Stránka vyhledávání (/hledat) - Filtry (2 kategorie, lokace, hodnocení, cena), seznam specialistů
- ✅ Detail specialisty (/specialista/[slug]) - Profil, služby, recenze, kontaktní formulář
- ✅ Ceník (/ceny) - 3 tarify (Basic 300 Kč, Pro 800 Kč, Premium 1500 Kč)
- ✅ O nás (/o-nas) - Mise, hodnoty, výhody
- ✅ Kontakt (/kontakt) - Kontaktní formulář a informace
- ✅ Právní stránky (/pravidla, /ochrana-osobnich-udaju)

**Provider sekce:**
- ✅ Přihlášení (/profi/prihlaseni) - Login formulář
- ✅ Registrace (/profi/registrace) - Kompletní registrační formulář
- ✅ Dashboard (/profi/dashboard) - Statistiky, poslední leady, quick actions

### 🚧 Fáze 2 - Zbývá doprogramovat

**Frontend pokročilé funkce:**
- ⏳ 7-krokový registrační wizard (aktuálně jednoduchý formulář)
- ⏳ Provider CRM funkcionality (správa leadů, konverzace)
- ⏳ LeadForm modal (rychlá poptávka)
- ⏳ Notifikační systém
- ⏳ Správa recenzí (write review form)
- ⏳ Upload profilových fotek
- ⏳ i18n implementace (Czech/Slovak switching)
- ⏳ SEO optimalizace (meta tagy, structured data, sitemap)
- ⏳ CookieBanner s TCF 2.2

**Backend (Fáze 2):**
- ⏳ NestJS API s PostgreSQL
- ⏳ Autentizace (JWT + Refresh tokens)
- ⏳ Email service (SendGrid/Mailgun)
- ⏳ Payment processing (Stripe/GoPay)
- ⏳ Admin panel
- ⏳ Analytics tracking

## 🛠 Technologie

- **Framework:** Next.js 16+ (App Router)
- **UI:** React 19+, TailwindCSS 4+, shadcn/ui
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack Query (React Query)
- **TypeScript:** Strict mode
- **Icons:** Lucide React

## 📝 Další kroky

**Fáze 1 - Hotovo** ✅
Frontend MVP je kompletní s mock daty a připravený pro napojení na backend API.

**Fáze 2 - Backend (Priorita):**
1. **NestJS projekt setup** - TypeORM + PostgreSQL
2. **API endpointy** - CRUD operace pro specialisty, leady, reviews
3. **Autentizace** - JWT tokens, registrace, login
4. **Email notifikace** - SendGrid integrace
5. **Payment processing** - Stripe/GoPay pro subscription model
6. **Admin panel** - Správa uživatelů a leadů

**Fáze 3 - Pokročilé frontend funkce:**
1. **7-step registration wizard** - Postupné onboarding
2. **CRM dashboard** - Správa leadů, kalendář, statistiky
3. **Real-time notifikace** - WebSockets pro nové leady
4. **i18n** - CS/SK language switching
5. **SEO** - Metadata, structured data, sitemap.xml
6. **Performance** - Image optimization, code splitting

## 🎨 Design system

### Barvy
- Primary: `#0ea5e9` (sky blue)
- Success (Verified): `#10b981` (green)
- Top (Gold): `#f59e0b` (amber)
- Danger: `#ef4444` (red)

### Typography
- Font: Inter
- Headings: Bold
- Body: Regular

### Komponenty
- Cards: `rounded-lg shadow-sm p-6`
- Buttons: Primary/Outline/Ghost varianty
- Badges: Success/Gold/Default

## 📱 Responsive breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔒 Environment variables

Viz `.env.example` pro kompletní seznam.

**Pro lokální vývoj:**
```bash
cp .env.example .env.local
```

**Pro Vercel deployment:**
V Vercel dashboardu nastavte tyto environment variables:
- `NEXT_PUBLIC_SITE_URL` - URL vaší Vercel aplikace (např. https://tvujspecialista.vercel.app)
- Ostatní variables jsou volitelné pro MVP s mock daty

## 🚀 Deployment na Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JanciNeviemProste/tvujspecialista)

### Manuální deployment:

1. **Push na GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercel Setup:**
   - Přihlaste se na [vercel.com](https://vercel.com)
   - Import projektu z GitHub
   - Vercel automaticky detekuje Next.js
   - Nastavte root directory na `frontend/`
   - Deploy!

3. **Po deploymenti:**
   - Vercel automaticky generuje HTTPS URL
   - Každý push na main spustí nový deployment
   - Preview deployments pro pull requesty

### Build poznámky:
- ⚠️ Lokální production build může selhat kvůli českým znakům v cestě (Turbopack bug)
- ✅ Dev server funguje bez problémů (`npm run dev`)
- ✅ Vercel build environment nemá tento problém a build projde úspěšně

## 🐛 Známé problémy a řešení

### Turbopack path issue
**Problém:** Build selže s chybou "panic: path contains invalid UTF-8 character" při českých znacích v cestě.

**Řešení:**
- Pro lokální vývoj: Použijte `npm run dev` (funguje normálně)
- Pro produkci: Deploy na Vercel (build projde bez problémů)

### Server Components a event handlers
**Problém:** Next.js 16 je přísný na míchání Server/Client Components.

**Řešení:**
- Všechny event handlers (`onClick`, `onChange`, `onError`) vyžadují `'use client'` direktivu
- Aktuálně používáme pure Server Components s HTML + Tailwind
- Pro interaktivitu přidejte `'use client'` na začátek souboru

### Image onError handlers
**Problém:** `onError` handler na `<img>` tagu v Server Component způsobí build error.

**Řešení:**
- Odstraněn všude kde byl používán
- Používáme CSS fallback: `bg-gray-200` pro placeholder

## 📚 Dokumentace

### Přidání nové stránky
```typescript
// app/nova-stranka/page.tsx
export default function NovaStranka() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Váš obsah */}
    </div>
  )
}
```

### Přidání nové komponenty
```typescript
// components/shared/MyComponent.tsx
export function MyComponent({ prop }: { prop: string }) {
  return <div>{prop}</div>
}
```

### Mock data pattern
```typescript
// V souboru stránky
const mockData = [
  { id: '1', name: 'Jan Novák', /* ... */ },
  // ...
]

export default function Page() {
  return (
    <div>
      {mockData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## 🔗 Odkazy

- **Live site:** https://tvujspecialista.vercel.app
- **GitHub:** https://github.com/JanciNeviemProste/tvujspecialista
- **Vercel Dashboard:** [Vercel Project](https://vercel.com/dashboard)

## 📄 Licence

Proprietary - tvujspecialista.cz
