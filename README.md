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

- ✅ Next.js 14 projekt s TypeScript
- ✅ TailwindCSS konfigurace
- ✅ Základní UI komponenty (Button, Card, Input, Badge)
- ✅ TypeScript typy pro všechny entity
- ✅ Mock data (10 specialistů, reviews, kategorie, lokality)
- ✅ Homepage s hero sekci a vyhledáváním
- ✅ React Query provider
- ✅ Responsive design struktura

### 🚧 Zbývá doprogramovat

- ⏳ Stránka vyhledávání (/hledat) s filtry
- ⏳ Detail specialisty (/specialista/[slug])
- ⏳ 7-krokový registrační wizard
- ⏳ Provider dashboard s CRM
- ⏳ LeadForm modal
- ⏳ Kompletní Header a Footer komponenty
- ⏳ SpecialistCard, ReviewCard komponenty
- ⏳ RatingStars komponenta
- ⏳ Stránka s cenami
- ⏳ Právní stránky (pravidla, privacy)
- ⏳ API funkce a React Query hooks
- ⏳ i18n implementace (CS/SK)
- ⏳ SEO optimalizace
- ⏳ CookieBanner s TCF 2.2

## 🛠 Technologie

- **Framework:** Next.js 16+ (App Router)
- **UI:** React 19+, TailwindCSS 4+, shadcn/ui
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack Query (React Query)
- **TypeScript:** Strict mode
- **Icons:** Lucide React

## 📝 Další kroky

1. **Dokončit vyhledávací stránku** - implementovat FilterPanel a SpecialistCard
2. **Detail specialisty** - kompletní profil s reviews a contact formem
3. **Registrační wizard** - 7-step onboarding pro poskytovatele
4. **Dashboard** - CRM pro správu leadů a recenzí
5. **API layer** - dokončit mock API funkce
6. **i18n** - české a slovenské lokalizace
7. **SEO** - meta tagy, structured data, sitemap

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

## 📄 Licence

Proprietary - tvujspecialista.cz
