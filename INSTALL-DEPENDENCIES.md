# Required Dependencies Installation

## Frontend Dependencies

Pre správne fungovanie 3-tier subscription systému je potrebné nainštalovať nasledujúce balíčky:

### Radix UI Components

```bash
npm install @radix-ui/react-dialog
npm install @radix-ui/react-separator
npm install class-variance-authority
```

### Stripe

```bash
npm install @stripe/stripe-js
```

### Date Utilities

```bash
npm install date-fns
```

### Toast Notifications

Ak ešte nemáte `sonner`:
```bash
npm install sonner
```

### React Query

Ak ešte nemáte `@tanstack/react-query`:
```bash
npm install @tanstack/react-query
```

## Backend Dependencies

Backend by mal mať všetky potrebné dependencies. Overiť:

```bash
cd backend
npm install
```

Potrebné balíčky (už by mali byť v package.json):
- `stripe`
- `@nestjs/typeorm`
- `@nestjs/config`
- `@nestjs/schedule`

## Complete Installation Command

### Frontend
```bash
npm install @radix-ui/react-dialog @radix-ui/react-separator @stripe/stripe-js date-fns sonner class-variance-authority
```

### Backend
```bash
cd backend
npm install
```

## Verify Installation

Po inštalácii overiť:

```bash
# Frontend
npm list @radix-ui/react-dialog
npm list @stripe/stripe-js
npm list date-fns

# Backend
cd backend
npm list stripe
npm list @nestjs/typeorm
```

## Development Setup

1. **Frontend:**
   ```bash
   npm install
   npm run dev
   ```

2. **Backend:**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

3. **Database:**
   ```bash
   # Run migration
   psql -U user -d database -f backend/migration-3-tier-subscriptions.sql
   ```

## Environment Variables

Nezabudnite nastaviť všetky potrebné environment variables podľa `3-TIER-SUBSCRIPTION-IMPLEMENTATION.md`
