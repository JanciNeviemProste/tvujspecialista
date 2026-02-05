# TvujSpecialista.cz

**Prémiová edu-komunitná platforma pre realitných agentov a finančných poradcov**

Moderná full-stack platforma spojujúca vzdelávanie, komunitu a obchodné príležitosti.

🌐 **Live Demo**: https://tvujspecialista.vercel.app

---

## 🎯 O Projekte

TvujSpecialista.cz je komplexné riešenie pre profesionálov v realitnom a finančnom poradenstve, ktoré zahŕňa:

### 🎓 **Academy Module**
- Video kurzy s certifikátmi
- Študijné materiály na stiahnutie
- Progress tracking a learning dashboard
- Kurzy od odborných lektorov s dlhoročnou praxou
- Filtre podľa kategórie, úrovne a obľúbenosti

### 🤝 **Community Module**
- Networking eventy a workshopy
- Online a offline stretnutia
- RSVP systém s kapacitou miest
- Komunitné diskusie a zdieľanie skúseností
- Exkluzívne webináre pre členov

### 💼 **Marketplace & Deal Management**
- Kanban deal pipeline (New → Contacted → Qualified → In Progress → Closed)
- Commission tracking systém
- Automatické vytváranie provízií z uzatvorených dealov
- Payment processing cez Stripe
- CRM nástroje pre správu obchodov

### 💎 **3-Tier Subscription System**
- **Education** (799 Kč/mesiac): Plný prístup k Academy
- **Marketplace** (1,999 Kč/mesiac): Deal pipeline + Commissions
- **Premium** (2,499 Kč/mesiac): Všetko + VIP podpora (úspora 20%)

### 👥 **Pre zákazníkov**
- Vyhľadávanie specialistov podľa kategórie a lokality
- Recenzie a hodnotenia
- Jednoduché odosielanie poptávok

### 📊 **Pre adminy**
- Správa uživateľov a specialistov
- Verifikácia specialistov
- Štatistiky platformy

---

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Auth**: JWT tokens (localStorage + secure contexts)
- **HTTP Client**: Axios with interceptors
- **UI Components**: Radix UI + custom components
- **Dark Mode**: Native CSS variables support
- **Deployment**: Vercel

### Backend
- **Framework**: NestJS 11
- **Database**: PostgreSQL 15 + TypeORM
- **Authentication**: JWT (access + refresh tokens)
- **Email**: SendGrid (transactional emails)
- **Payments**: Stripe (subscriptions + payment intents)
- **File Upload**: Cloudinary
- **Webhooks**: Stripe webhook handlers
- **Guards**: Role-based + Subscription-based access control
- **Deployment**: Render.com

---

## 📂 Project Structure

```
tvujspecialista-main/
├── app/                     # Next.js frontend
│   ├── hledat/             # Search page
│   ├── specialista/        # Specialist detail
│   ├── profi/              # Specialist area
│   │   ├── prihlaseni/    # Login
│   │   ├── registrace/    # Registration
│   │   └── dashboard/     # Dashboard
│   └── ceny/              # Pricing
├── components/            # React components
├── contexts/              # React contexts (Auth)
├── lib/
│   ├── api/              # API client layer
│   └── hooks/            # React Query hooks
├── types/                # TypeScript types
│
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── auth/        # Auth module (JWT)
│   │   ├── specialists/ # Specialists module
│   │   ├── leads/       # Leads module
│   │   ├── reviews/     # Reviews module
│   │   ├── stripe/      # Stripe payments
│   │   ├── email/       # Email service
│   │   ├── cloudinary/  # File upload
│   │   ├── admin/       # Admin module
│   │   └── database/
│   │       ├── entities/  # TypeORM entities
│   │       └── seeds/     # Database seeder
│   └── docker-compose.yml # PostgreSQL
│
└── mocks/               # Mock data (for development)
```

---

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- npm or yarn

### 1. Clone Repository

```bash
git clone https://github.com/JanciNeviemProste/tvujspecialista.git
cd tvujspecialista-main
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your credentials

# Start PostgreSQL
docker-compose up -d

# Seed database (1 admin + 9 specialists)
npm run seed

# Start backend
npm run start:dev
```

Backend runs on: **http://localhost:3001**

API Docs (Swagger): **http://localhost:3001/api/docs**

**Test login credentials:**
- Admin: `admin@tvujspecialista.cz` / `Admin123!`
- Specialists: `{email from seeder}` / `Specialist123!`

### 3. Frontend Setup

```bash
# Return to root directory
cd ..

# Install dependencies
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local

# Start frontend
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## 🌐 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import project on Vercel
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```
4. Deploy

**Current deployment**: https://tvujspecialista.vercel.app

### Backend (Render.com)

1. Create new Web Service on Render
2. Connect GitHub repository
3. Set root directory: `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm run start:prod`
6. Add PostgreSQL database (managed)
7. Configure environment variables (see `backend/.env.example`)
8. Deploy
9. Run seeder via Render Shell: `npm run seed`

**Detailed deployment guide**: See `backend/README.md`

---

## 📚 Documentation

- **Backend API**: See `backend/README.md`
- **Swagger API Docs**: http://localhost:3001/api/docs (when running)
- **Deployment Guide**: See backend/README.md section "Deployment (Render.com)"

---

## 🔑 Features

### ✅ Implemented (Production-Ready)

**Core Platform:**
- [x] User authentication (JWT with refresh tokens)
- [x] Specialist registration & profiles
- [x] Search & filters (category, location, rating)
- [x] Reviews & ratings system
- [x] Profile photo upload (Cloudinary)
- [x] Admin panel & statistics
- [x] Email notifications (SendGrid)

**Academy Module:**
- [x] Video course catalog with filters
- [x] Course detail pages with curriculum
- [x] Learning environment with video player
- [x] Progress tracking (lessons completed)
- [x] Enrollment system
- [x] My Learning dashboard
- [x] Course ratings & reviews
- [x] Featured courses section

**Community Module:**
- [x] Events catalog (online/offline)
- [x] Event detail pages with RSVP
- [x] Capacity management
- [x] My Events dashboard
- [x] RSVP confirmation & cancellation
- [x] Event filtering & search

**Deals & Commissions:**
- [x] Deal pipeline (Kanban board)
- [x] Deal status management (6 statuses)
- [x] Deal value & close date tracking
- [x] Commission auto-creation on deal close
- [x] Commission payment via Stripe
- [x] Commission dashboard & stats
- [x] Deal list & grid views

**Subscriptions:**
- [x] 3-tier subscription system (Education, Marketplace, Premium)
- [x] Stripe Checkout integration
- [x] Subscription management page
- [x] Cancel/resume subscriptions
- [x] Subscription-based access control
- [x] Pricing page with comparison table

**UI/UX:**
- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark mode support
- [x] Loading skeletons & states
- [x] Error boundaries (global + per module)
- [x] 404 & error pages
- [x] Toast notifications
- [x] Modal dialogs
- [x] Mobile navigation (hamburger menu)

**Performance & SEO:**
- [x] Next.js Image optimization
- [x] Code splitting & lazy loading
- [x] SEO meta tags (Open Graph, Twitter Cards)
- [x] Sitemap & robots.txt ready
- [x] Accessibility (WCAG 2.1 AA compliant)

### 🔜 Planned (Future Enhancements)

- [ ] SMS notifications (Twilio)
- [ ] Video consultation booking
- [ ] Advanced analytics dashboard (Charts.js)
- [ ] Multi-language support (i18n: EN, SK)
- [ ] Mobile app (React Native)
- [ ] AI-powered course recommendations
- [ ] Live streaming for events
- [ ] Community forums & discussions

---

## 🧪 Testing

### End-to-End Test Flow

1. **Customer finds specialist**
   ```
   Visit /hledat → Filter by category/location → View specialist profile
   ```

2. **Customer creates lead**
   ```
   Fill contact form → Submit → Receive confirmation email
   ```

3. **Specialist receives lead**
   ```
   Receive email notification → Login → View lead in dashboard
   ```

4. **Specialist manages lead**
   ```
   Update status (New → Contacted → Scheduled → Closed)
   Add notes
   ```

5. **Specialist upgrades subscription**
   ```
   Dashboard → Upgrade plan → Stripe checkout → Webhook updates tier
   ```

### Test Admin Panel

```bash
# Login as admin
POST /api/auth/login
Body: {"email":"admin@tvujspecialista.cz","password":"Admin123!"}

# Get statistics
GET /api/admin/stats
Authorization: Bearer <admin_token>

# Verify specialist
PATCH /api/admin/specialists/:id/verify
Authorization: Bearer <admin_token>
```

---

## 🔒 Security

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens (15min access, 7 day refresh)
- ✅ Role-based access control
- ✅ Stripe webhook signature verification
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ SQL injection prevention (TypeORM)

---

## 💎 Subscription Tiers

| Tier | Price (CZK/mesiac) | Features |
|------|-------------------|----------|
| **Education** | 799 | Prístup ku všetkým kurzom v Academy, Videolekcie s odborníkmi, Študijné materiály, Certifikáty, Komunitný prístup |
| **Marketplace** | 1,999 | Deals pipeline management, Commission tracking, Premium listing, Lead management, Pokročilá analytika, CRM integrácie |
| **Premium** | 2,499 | **Všetko z Education + Marketplace**, Exkluzívne webináre, Osobný account manager, API prístup, VIP podpora 24/7, **Úspora 20%** |

> **Poznámka**: Všetky plány sú fakturované mesačne cez Stripe. Možnosť zrušenia kedykoľvek bez sankcií.

---

## 🤝 Contributing

This is a private project. For any questions or suggestions, please contact the repository owner.

---

## 📄 License

UNLICENSED - Private project

---

## 📞 Contact

- **GitHub**: https://github.com/JanciNeviemProste/tvujspecialista
- **Live Demo**: https://tvujspecialista.vercel.app

---

## 🎉 Credits

Built with ❤️ using Next.js 16, React 19, NestJS 11, PostgreSQL, Stripe, SendGrid, and Cloudinary.

**Development Timeline**:
- Sprint 1-2: Core Platform (Auth, Specialists, Leads) - 5 days
- Sprint 3: Academy Module - 3 days
- Sprint 4: Community Module - 2 days
- Sprint 5: Deals & Commissions - 2 days
- Sprint 6: 3-Tier Subscriptions + Production Polish - 3 days

**Total**: 15 days of intensive development with parallel task execution.

---

## 📸 Screenshots

### Homepage
Premium landing page s hero sekciou a kategóriami specialistov.

### Academy
Katalóg kurzov s filtrami, course detail pages, a learning environment s video playerom.

### Community
Events katalóg s RSVP systémom, event detail pages, a my events dashboard.

### Deals Pipeline
Kanban board s drag & drop (plánované), deal management, a commission tracking.

### Subscriptions
Pricing page s 3 plánmi, subscription management, a Stripe Checkout integrácia.
