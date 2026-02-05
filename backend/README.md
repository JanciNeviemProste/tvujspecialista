# tvujspecialista.cz - Backend API

NestJS backend API pro platforma spojující zákazníky se specialisty (finanční poradci, realitní makléři).

## 🚀 Tech Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL 15 + TypeORM
- **Authentication**: JWT (Access + Refresh tokens)
- **Email**: SendGrid
- **Payments**: Stripe
- **File Upload**: Cloudinary
- **Validation**: class-validator, class-transformer

---

## 📋 Features

### ✅ Implemented Modules

1. **Auth Module** (`/api/auth`)
   - Registration (specialist + customer)
   - Login with JWT tokens
   - Token refresh
   - Password hashing (bcrypt, 10 rounds)

2. **Specialists Module** (`/api/specialists`)
   - List all specialists (filters, search, pagination)
   - Get specialist by slug
   - Update specialist profile
   - Photo upload (Cloudinary)

3. **Leads Module** (`/api/leads`)
   - Create lead (customer inquiry)
   - Get my leads (specialist)
   - Update lead status
   - Add notes to lead
   - Email notifications (SendGrid)
   - Lead limit enforcement by subscription tier

4. **Reviews Module** (`/api/reviews`)
   - Get reviews by specialist
   - Submit review (with token)
   - Specialist response to review

5. **Stripe Payments Module** (`/api/payments`, `/api/subscriptions`)
   - Create checkout session
   - Customer portal link
   - Webhook handling (subscription lifecycle)
   - Subscription tiers: Basic (10 leads), Pro (50 leads), Premium (unlimited)

6. **Admin Module** (`/api/admin`)
   - Get all users
   - Get all specialists
   - Verify specialist
   - Get all leads
   - Dashboard statistics

7. **Email Service**
   - New lead notification (to specialist)
   - Lead confirmation (to customer)
   - Welcome email (on registration)

8. **Cloudinary Upload**
   - Profile photo upload
   - Image transformation (800x800)

---

## 🛠️ Setup (Development)

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for PostgreSQL)
- npm or yarn

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required:**
- `DATABASE_*` - PostgreSQL connection (auto-configured if using docker-compose)
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `JWT_REFRESH_SECRET` - Generate with: `openssl rand -base64 32`
- `SENDGRID_API_KEY` - Get from [SendGrid](https://sendgrid.com)
- `STRIPE_SECRET_KEY` - Get from [Stripe Dashboard](https://dashboard.stripe.com)
- `STRIPE_WEBHOOK_SECRET` - Get after setting up webhook endpoint

**Optional:**
- `CLOUDINARY_*` - For profile photo uploads

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

This starts PostgreSQL on port 5432.

### 4. Run Database Seeder

Populate database with 1 admin + 9 specialists + sample reviews:

```bash
npm run seed
```

**Login credentials after seeding:**
- Admin: `admin@tvujspecialista.cz` / `Admin123!`
- Specialists: `{specialist-email}` / `Specialist123!`

### 5. Start Development Server

```bash
npm run start:dev
```

Backend runs on: **http://localhost:3001**

API Documentation (Swagger): **http://localhost:3001/api/docs**

---

## 🌐 Deployment (Render.com)

### 1. Create New Web Service on Render

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- **Root Directory**: `backend`

### 2. Add PostgreSQL Database

Create managed PostgreSQL database on Render and copy the internal connection URL.

### 3. Environment Variables

Add these in Render Dashboard → Environment:

```
DATABASE_URL=<Render PostgreSQL internal URL>
JWT_SECRET=<generate 32+ char random string>
JWT_REFRESH_SECRET=<generate 32+ char random string>
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
SENDGRID_API_KEY=<from SendGrid account>
SENDGRID_FROM_EMAIL=noreply@tvujspecialista.cz
STRIPE_SECRET_KEY=<from Stripe account>
STRIPE_WEBHOOK_SECRET=<from Stripe webhook setup>
STRIPE_BASIC_PRICE_ID=<from Stripe Dashboard>
STRIPE_PRO_PRICE_ID=<from Stripe Dashboard>
STRIPE_PREMIUM_PRICE_ID=<from Stripe Dashboard>
CLOUDINARY_CLOUD_NAME=<optional>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
FRONTEND_URL=https://tvujspecialista.vercel.app
NODE_ENV=production
PORT=3001
```

### 4. After Deployment

Run seeder via Render Shell:

```bash
npm run seed
```

### 5. Setup Stripe Webhooks

In Stripe Dashboard → Webhooks:
- Add endpoint: `https://your-api.onrender.com/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- Copy webhook signing secret → Update `STRIPE_WEBHOOK_SECRET`

---

## 📚 API Documentation

### Public Endpoints

```
POST /api/auth/register       - Register new specialist
POST /api/auth/login          - Login (get JWT tokens)
POST /api/auth/refresh        - Refresh access token
GET  /api/specialists         - List specialists (filters, search, pagination)
GET  /api/specialists/:slug   - Get specialist details
POST /api/leads               - Create lead (customer inquiry)
GET  /api/reviews/:specialistId - Get reviews
POST /api/reviews             - Submit review (with token)
```

### Protected Endpoints (JWT Required)

```
GET    /api/auth/me                  - Get current user
POST   /api/auth/logout              - Logout (invalidate refresh token)
GET    /api/specialists/me           - Get my profile
PATCH  /api/specialists/me           - Update my profile
POST   /api/specialists/me/photo     - Upload profile photo
GET    /api/leads/my                 - Get my leads
PATCH  /api/leads/:id/status         - Update lead status
POST   /api/leads/:id/notes          - Add note to lead
POST   /api/payments/checkout        - Create Stripe checkout
POST   /api/payments/portal          - Get customer portal link
GET    /api/subscriptions/me         - Get my subscription
```

### Admin Endpoints (Admin Role Required)

```
GET   /api/admin/users                    - Get all users
GET   /api/admin/specialists              - Get all specialists
PATCH /api/admin/specialists/:id/verify  - Verify specialist
GET   /api/admin/leads                    - Get all leads
GET   /api/admin/stats                    - Dashboard statistics
```

### Webhooks

```
POST /api/webhooks/stripe  - Stripe webhook (signature verified)
```

**Full API documentation:** http://localhost:3001/api/docs (Swagger UI)

---

## 🗄️ Database Schema

### Entities

1. **User** - Base user entity (email, password, role)
2. **Specialist** - Specialist profile (bio, services, certifications, etc.)
3. **Lead** - Customer inquiry to specialist
4. **LeadEvent** - Lead activity log
5. **Review** - Customer review for specialist
6. **ReviewToken** - Token for verified review submission
7. **Subscription** - Stripe subscription data
8. **RefreshToken** - JWT refresh tokens

### Role Types

- `CUSTOMER` - Regular customer
- `SPECIALIST` - Service provider
- `ADMIN` - Platform administrator

### Subscription Tiers

- `basic` - 300 CZK/month, 10 leads
- `pro` - 800 CZK/month, 50 leads
- `premium` - 1500 CZK/month, unlimited leads

---

## 🧪 Testing

### Test Admin Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tvujspecialista.cz","password":"Admin123!"}'
```

### Test Admin Stats

```bash
curl http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer <admin_token>"
```

### Test Specialist List

```bash
curl "http://localhost:3001/api/specialists?category=Finanční+poradce&location=Praha"
```

---

## 📦 Scripts

```bash
npm run start:dev    # Development mode (hot reload)
npm run start:prod   # Production mode
npm run build        # Build for production
npm run seed         # Populate database with test data
npm run lint         # Run ESLint
npm run test         # Run unit tests
```

---

## 🔒 Security Features

- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT authentication (access + refresh tokens)
- ✅ Role-based access control (Guards)
- ✅ Stripe webhook signature verification
- ✅ Input validation (class-validator)
- ✅ CORS configuration
- ✅ SQL injection prevention (TypeORM)

---

## 📞 Support

- **Issues**: Create issue on GitHub
- **Documentation**: See Swagger UI at `/api/docs`

---

## 📄 License

UNLICENSED - Private project
