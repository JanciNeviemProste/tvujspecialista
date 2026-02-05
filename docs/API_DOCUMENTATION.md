# API Documentation - TvujSpecialista.cz Backend

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Authentication](#-authentication)
3. [Specialists Module](#-specialists-module)
4. [Leads Module](#-leads-module)
5. [Deals Module](#-deals-module)
6. [Commissions Module](#-commissions-module)
7. [Academy Module](#-academy-module)
8. [Community Module](#-community-module)
9. [Subscriptions Module](#-subscriptions-module)
10. [Reviews Module](#-reviews-module)
11. [Admin Module](#-admin-module)
12. [Common Schemas](#-common-schemas)
13. [Error Handling](#-error-handling)
14. [Authorization](#-authorization)
15. [Rate Limiting](#-rate-limiting)
16. [Testing](#-testing)

---

## 🌐 Overview

**Base URL:**
- Development: `http://localhost:3001/api`
- Production: `https://api.tvujspecialista.cz`

**API Version:** v1

**Protocol:** REST

**Content-Type:** `application/json`

**Authentication:** JWT Bearer tokens

**Swagger UI:** Available at `/api/docs` (interactive API documentation)

---

## 🔐 Authentication

### POST /auth/register

Register a new specialist account.

**Request Body:**
```json
{
  "name": "Jan Novák",
  "email": "jan.novak@example.com",
  "password": "securePassword123",
  "phone": "+420123456789",
  "category": "REAL_ESTATE",
  "location": "Praha",
  "yearsExperience": 5,
  "bio": "Experienced real estate specialist",
  "hourlyRate": 1500,
  "services": ["Residential", "Commercial"],
  "certifications": ["Licensed Real Estate Agent"],
  "education": "Master in Business Administration",
  "website": "https://example.com",
  "linkedin": "https://linkedin.com/in/jannovak",
  "availability": ["Monday 9-17", "Tuesday 9-17"]
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "email": "jan.novak@example.com",
    "name": "Jan Novák",
    "role": "SPECIALIST",
    "verified": false,
    "createdAt": "2026-02-05T10:00:00.000Z"
  }
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jan Novák",
    "email": "jan.novak@example.com",
    "password": "securePassword123",
    "phone": "+420123456789",
    "category": "REAL_ESTATE",
    "location": "Praha",
    "yearsExperience": 5
  }'
```

**Error Codes:**
- `400` - Validation error (missing fields, invalid email)
- `409` - Email already exists

---

### POST /auth/login

Authenticate and receive access tokens.

**Request Body:**
```json
{
  "email": "jan.novak@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-v4",
    "email": "jan.novak@example.com",
    "name": "Jan Novák",
    "role": "SPECIALIST",
    "verified": true,
    "subscriptionType": "MARKETPLACE"
  }
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jan.novak@example.com",
    "password": "securePassword123"
  }'
```

**Error Codes:**
- `400` - Invalid input
- `401` - Invalid credentials

---

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Error Codes:**
- `401` - Invalid or expired refresh token

---

### GET /auth/me

Get current authenticated user profile.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "userId": "uuid-v4",
  "email": "jan.novak@example.com",
  "name": "Jan Novák",
  "role": "SPECIALIST",
  "iat": 1738751234,
  "exp": 1738837634
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Error Codes:**
- `401` - Unauthorized (missing or invalid token)

---

### POST /auth/logout

Logout and invalidate refresh token.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 👤 Specialists Module

### GET /specialists

Get list of specialists with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by category (REAL_ESTATE, FINANCIAL)
- `location` (optional): Filter by location
- `search` (optional): Search by name or bio
- `verified` (optional): Filter by verification status (true/false)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-v4",
      "userId": "uuid-v4",
      "slug": "jan-novak",
      "category": "REAL_ESTATE",
      "location": "Praha",
      "bio": "Experienced real estate specialist",
      "yearsExperience": 5,
      "verified": true,
      "hourlyRate": 1500,
      "rating": 4.8,
      "reviewCount": 24,
      "profilePhoto": "https://res.cloudinary.com/...",
      "services": ["Residential", "Commercial"],
      "createdAt": "2026-01-01T10:00:00.000Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

**Example curl:**
```bash
curl -X GET "http://localhost:3001/api/specialists?category=REAL_ESTATE&location=Praha&verified=true&page=1&limit=10"
```

---

### GET /specialists/:slug

Get detailed specialist profile by slug.

**Response (200):**
```json
{
  "id": "uuid-v4",
  "userId": "uuid-v4",
  "slug": "jan-novak",
  "category": "REAL_ESTATE",
  "location": "Praha",
  "bio": "Experienced real estate specialist",
  "yearsExperience": 5,
  "verified": true,
  "hourlyRate": 1500,
  "rating": 4.8,
  "reviewCount": 24,
  "profilePhoto": "https://res.cloudinary.com/...",
  "services": ["Residential", "Commercial"],
  "certifications": ["Licensed Real Estate Agent"],
  "education": "Master in Business Administration",
  "website": "https://example.com",
  "linkedin": "https://linkedin.com/in/jannovak",
  "availability": ["Monday 9-17", "Tuesday 9-17"],
  "user": {
    "id": "uuid-v4",
    "email": "jan.novak@example.com",
    "name": "Jan Novák",
    "phone": "+420123456789"
  },
  "createdAt": "2026-01-01T10:00:00.000Z",
  "updatedAt": "2026-02-01T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/specialists/jan-novak
```

**Error Codes:**
- `404` - Specialist not found

---

### GET /specialists/me/profile

Get authenticated specialist's own profile.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "userId": "uuid-v4",
  "slug": "jan-novak",
  "category": "REAL_ESTATE",
  "location": "Praha",
  "bio": "Experienced real estate specialist",
  "verified": true,
  "subscriptionTier": "MARKETPLACE",
  "createdAt": "2026-01-01T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/specialists/me/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### PATCH /specialists/me

Update authenticated specialist's profile.

**Auth Required:** Yes

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "bio": "Updated bio text",
  "hourlyRate": 1800,
  "services": ["Residential", "Commercial", "Investment"],
  "location": "Praha 1",
  "availability": ["Monday 9-18", "Tuesday 9-18"]
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "userId": "uuid-v4",
  "bio": "Updated bio text",
  "hourlyRate": 1800,
  "services": ["Residential", "Commercial", "Investment"],
  "updatedAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/specialists/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio text",
    "hourlyRate": 1800
  }'
```

---

## 📝 Leads Module

### POST /leads

Create a new lead (public endpoint, no authentication required).

**Rate Limited:** Yes (LeadLimitGuard applied)

**Request Body:**
```json
{
  "specialistId": "uuid-v4",
  "customerName": "Petra Svobodová",
  "customerEmail": "petra.svobodova@example.com",
  "customerPhone": "+420987654321",
  "message": "I am interested in selling my apartment in Prague.",
  "gdprConsent": true
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "specialistId": "uuid-v4",
  "customerName": "Petra Svobodová",
  "customerEmail": "petra.svobodova@example.com",
  "customerPhone": "+420987654321",
  "message": "I am interested in selling my apartment in Prague.",
  "status": "NEW",
  "gdprConsent": true,
  "createdAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "specialistId": "uuid-v4",
    "customerName": "Petra Svobodová",
    "customerEmail": "petra.svobodova@example.com",
    "customerPhone": "+420987654321",
    "message": "I am interested in selling my apartment.",
    "gdprConsent": true
  }'
```

**Side Effects:**
- Sends email notification to specialist
- Creates CREATED event in lead timeline

**Error Codes:**
- `400` - Validation error
- `404` - Specialist not found
- `429` - Rate limit exceeded

---

### GET /leads/my

Get all leads for authenticated specialist.

**Auth Required:** Yes (Specialist only)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "customerName": "Petra Svobodová",
    "customerEmail": "petra.svobodova@example.com",
    "customerPhone": "+420987654321",
    "message": "I am interested in selling my apartment.",
    "status": "NEW",
    "notes": [],
    "createdAt": "2026-02-05T10:00:00.000Z",
    "updatedAt": "2026-02-05T10:00:00.000Z"
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/leads/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### PATCH /leads/:id/status

Update lead status (specialist owner only).

**Auth Required:** Yes (Owner only)

**Request Body:**
```json
{
  "status": "CONTACTED"
}
```

**Available Statuses:**
- `NEW`
- `CONTACTED`
- `QUALIFIED`
- `IN_PROGRESS`
- `CLOSED_WON`
- `CLOSED_LOST`

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "CONTACTED",
  "updatedAt": "2026-02-05T10:30:00.000Z"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/leads/uuid-v4/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONTACTED"}'
```

**Side Effects:**
- Creates STATUS_CHANGED event in lead timeline

---

### POST /leads/:id/notes

Add a note to a lead.

**Auth Required:** Yes

**Request Body:**
```json
{
  "note": "Called customer, scheduled meeting for next Monday."
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "notes": [
    "Called customer, scheduled meeting for next Monday."
  ],
  "updatedAt": "2026-02-05T10:45:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/leads/uuid-v4/notes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note": "Called customer, scheduled meeting for next Monday."}'
```

**Side Effects:**
- Creates NOTE_ADDED event in lead timeline

---

## 💼 Deals Module

### POST /deals

Create a new deal (public endpoint).

**Rate Limited:** Yes (LeadLimitGuard applied)

**Request Body:**
```json
{
  "specialistId": "uuid-v4",
  "customerName": "Karel Dvořák",
  "customerEmail": "karel.dvorak@example.com",
  "customerPhone": "+420777888999",
  "message": "Looking to invest in commercial real estate.",
  "gdprConsent": true
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "specialistId": "uuid-v4",
  "customerName": "Karel Dvořák",
  "customerEmail": "karel.dvorak@example.com",
  "status": "NEW",
  "dealValue": null,
  "createdAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/deals \
  -H "Content-Type: application/json" \
  -d '{
    "specialistId": "uuid-v4",
    "customerName": "Karel Dvořák",
    "customerEmail": "karel.dvorak@example.com",
    "customerPhone": "+420777888999",
    "message": "Looking to invest in commercial real estate.",
    "gdprConsent": true
  }'
```

---

### GET /deals/my

Get all deals for authenticated specialist.

**Auth Required:** Yes (Specialist only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "customerName": "Karel Dvořák",
    "customerEmail": "karel.dvorak@example.com",
    "customerPhone": "+420777888999",
    "message": "Looking to invest in commercial real estate.",
    "status": "QUALIFIED",
    "dealValue": 5000000,
    "estimatedCloseDate": "2026-03-15",
    "actualCloseDate": null,
    "notes": ["Initial meeting completed", "Sent proposal"],
    "createdAt": "2026-02-01T10:00:00.000Z",
    "updatedAt": "2026-02-05T14:30:00.000Z"
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/deals/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### PATCH /deals/:id/status

Update deal status.

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "IN_PROGRESS",
  "updatedAt": "2026-02-05T15:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/deals/uuid-v4/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "IN_PROGRESS"}'
```

**Side Effects:**
- Creates STATUS_CHANGED event
- Sends email notification to specialist

---

### PATCH /deals/:id/value

Set deal value and estimated close date.

**Auth Required:** Yes

**Request Body:**
```json
{
  "dealValue": 5000000,
  "estimatedCloseDate": "2026-03-15"
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "dealValue": 5000000,
  "estimatedCloseDate": "2026-03-15",
  "updatedAt": "2026-02-05T15:30:00.000Z"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/deals/uuid-v4/value \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dealValue": 5000000,
    "estimatedCloseDate": "2026-03-15"
  }'
```

**Side Effects:**
- Sends email notification to specialist

---

### PATCH /deals/:id/close

Close a deal as won or lost.

**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "CLOSED_WON",
  "actualDealValue": 4800000
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "CLOSED_WON",
  "actualCloseDate": "2026-02-05",
  "actualDealValue": 4800000,
  "updatedAt": "2026-02-05T16:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/deals/uuid-v4/close \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CLOSED_WON",
    "actualDealValue": 4800000
  }'
```

**Side Effects:**
- If `CLOSED_WON`: Creates commission record
- Sends email notification to specialist
- Updates deal analytics

**Error Codes:**
- `400` - Invalid status (must be CLOSED_WON or CLOSED_LOST)
- `400` - actualDealValue required for CLOSED_WON

---

### POST /deals/:id/reopen

Reopen a closed lost deal.

**Auth Required:** Yes

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "IN_PROGRESS",
  "actualCloseDate": null,
  "updatedAt": "2026-02-05T16:30:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/deals/uuid-v4/reopen \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Error Codes:**
- `400` - Cannot reopen CLOSED_WON deals
- `400` - Deal must be CLOSED_LOST to reopen

---

### POST /deals/:id/notes

Add a note to a deal.

**Auth Required:** Yes

**Request Body:**
```json
{
  "note": "Customer requested price adjustment. Revised proposal sent."
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "notes": [
    "Initial meeting completed",
    "Sent proposal",
    "Customer requested price adjustment. Revised proposal sent."
  ],
  "updatedAt": "2026-02-05T17:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/deals/uuid-v4/notes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note": "Customer requested price adjustment."}'
```

**Side Effects:**
- Creates NOTE_ADDED event

---

### GET /deals/my/events/:dealId

Get timeline of all events for a specific deal (Phase 3 feature).

**Auth Required:** Yes (Owner only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "leadId": "uuid-v4",
    "type": "CREATED",
    "data": {},
    "createdAt": "2026-02-01T10:00:00.000Z"
  },
  {
    "id": "uuid-v4",
    "leadId": "uuid-v4",
    "type": "STATUS_CHANGED",
    "data": {
      "from": "NEW",
      "to": "CONTACTED"
    },
    "createdAt": "2026-02-01T14:30:00.000Z"
  },
  {
    "id": "uuid-v4",
    "leadId": "uuid-v4",
    "type": "NOTE_ADDED",
    "data": {
      "note": "Initial meeting completed"
    },
    "createdAt": "2026-02-02T09:15:00.000Z"
  },
  {
    "id": "uuid-v4",
    "leadId": "uuid-v4",
    "type": "EMAIL_SENT",
    "data": {
      "subject": "Deal status update",
      "recipient": "karel.dvorak@example.com"
    },
    "createdAt": "2026-02-02T09:20:00.000Z"
  }
]
```

**Event Types:**
- `CREATED` - Deal was created
- `STATUS_CHANGED` - Deal status updated
- `NOTE_ADDED` - Note added to deal
- `EMAIL_SENT` - Email notification sent

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/deals/my/events/uuid-v4 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Error Codes:**
- `403` - Not authorized (not deal owner)
- `404` - Deal not found

---

### GET /deals/my/analytics

Get analytics and metrics for specialist's deals (Phase 3 feature).

**Auth Required:** Yes (Specialist only)

**Response (200):**
```json
{
  "conversionRate": 28.5,
  "averageDealValue": 3250000,
  "averageTimeToClose": 45,
  "winRate": 65.2,
  "statusDistribution": [
    { "status": "NEW", "count": 12 },
    { "status": "CONTACTED", "count": 8 },
    { "status": "QUALIFIED", "count": 5 },
    { "status": "IN_PROGRESS", "count": 7 },
    { "status": "CLOSED_WON", "count": 15 },
    { "status": "CLOSED_LOST", "count": 8 }
  ],
  "monthlyTrend": [
    { "month": "2025-12", "won": 3, "lost": 1 },
    { "month": "2026-01", "won": 5, "lost": 2 },
    { "month": "2026-02", "won": 7, "lost": 5 }
  ]
}
```

**Metrics Explained:**
- `conversionRate`: Percentage of leads that became qualified deals
- `averageDealValue`: Average value of all closed won deals (CZK)
- `averageTimeToClose`: Average days from creation to close
- `winRate`: Percentage of closed deals that were won
- `statusDistribution`: Count of deals by current status
- `monthlyTrend`: Won/lost deals per month (last 12 months)

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/deals/my/analytics \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💰 Commissions Module

### GET /commissions/my

Get all commissions for authenticated specialist.

**Auth Required:** Yes (Specialist only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "dealId": "uuid-v4",
    "dealValue": 4800000,
    "commissionRate": 0.15,
    "commissionAmount": 720000,
    "status": "PENDING",
    "calculatedAt": "2026-02-05T16:00:00.000Z",
    "dueDate": "2026-03-07T16:00:00.000Z",
    "invoicedAt": null,
    "paidAt": null,
    "deal": {
      "id": "uuid-v4",
      "customerName": "Karel Dvořák",
      "actualCloseDate": "2026-02-05"
    }
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/commissions/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### GET /commissions/my/stats

Get commission statistics for authenticated specialist.

**Auth Required:** Yes (Specialist only)

**Response (200):**
```json
{
  "totalEarnings": 2150000,
  "pendingAmount": 720000,
  "paidAmount": 1430000,
  "pendingCount": 3,
  "paidCount": 8
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/commissions/my/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /commissions/:id/pay

Initiate commission payment via Stripe.

**Auth Required:** Yes

**Response (200):**
```json
{
  "clientSecret": "pi_3AbCdEfGhIjKlMnO_secret_PqRsTuVwXyZ123456",
  "amount": 720000,
  "currency": "czk"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/commissions/uuid-v4/pay \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Note:** Use the `clientSecret` to complete payment on frontend with Stripe Elements.

---

### GET /commissions/pending (ADMIN ONLY)

Get all pending commissions (admin only).

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "specialistId": "uuid-v4",
    "dealValue": 4800000,
    "commissionAmount": 720000,
    "status": "PENDING",
    "dueDate": "2026-03-07T16:00:00.000Z",
    "specialist": {
      "id": "uuid-v4",
      "user": {
        "name": "Jan Novák",
        "email": "jan.novak@example.com"
      }
    }
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/commissions/pending \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

**Error Codes:**
- `403` - Forbidden (requires admin role)

---

### POST /commissions/:id/waive (ADMIN ONLY)

Waive a commission (mark as not requiring payment).

**Auth Required:** Yes (Admin only)

**Request Body:**
```json
{
  "note": "Waived as promotional offer for new specialist"
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "WAIVED",
  "notes": "Waived as promotional offer for new specialist",
  "updatedAt": "2026-02-05T18:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/commissions/uuid-v4/waive \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"note": "Waived as promotional offer"}'
```

---

## 🎓 Academy Module

### GET /academy/courses

List all published courses with optional filtering.

**Query Parameters:**
- `category` (optional): REAL_ESTATE, FINANCIAL, BOTH
- `level` (optional): BEGINNER, INTERMEDIATE, ADVANCED
- `featured` (optional): true/false
- `search` (optional): Search in title/description
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-v4",
      "slug": "real-estate-basics",
      "title": "Real Estate Basics for Beginners",
      "description": "Learn fundamental concepts of real estate...",
      "thumbnailUrl": "https://res.cloudinary.com/...",
      "level": "BEGINNER",
      "category": "REAL_ESTATE",
      "instructorName": "Ing. Marie Nováková",
      "duration": 420,
      "moduleCount": 6,
      "lessonCount": 24,
      "enrollmentCount": 156,
      "rating": 4.7,
      "reviewCount": 42,
      "published": true,
      "featured": true,
      "createdAt": "2025-12-01T10:00:00.000Z"
    }
  ],
  "total": 12,
  "page": 1,
  "limit": 10
}
```

**Example curl:**
```bash
curl -X GET "http://localhost:3001/api/academy/courses?category=REAL_ESTATE&level=BEGINNER"
```

---

### GET /academy/courses/:slug

Get full course details including modules and lessons.

**Response (200):**
```json
{
  "id": "uuid-v4",
  "slug": "real-estate-basics",
  "title": "Real Estate Basics for Beginners",
  "description": "Learn fundamental concepts...",
  "thumbnailUrl": "https://res.cloudinary.com/...",
  "level": "BEGINNER",
  "category": "REAL_ESTATE",
  "instructorName": "Ing. Marie Nováková",
  "instructorBio": "20+ years in real estate education",
  "instructorPhoto": "https://res.cloudinary.com/...",
  "duration": 420,
  "moduleCount": 6,
  "lessonCount": 24,
  "rating": 4.7,
  "modules": [
    {
      "id": "uuid-v4",
      "title": "Introduction to Real Estate",
      "description": "Overview of the industry",
      "position": 1,
      "lessons": [
        {
          "id": "uuid-v4",
          "title": "What is Real Estate?",
          "description": "Basic definitions",
          "type": "VIDEO",
          "duration": 15,
          "position": 1
        }
      ]
    }
  ]
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/academy/courses/real-estate-basics
```

---

### POST /academy/enrollments

Enroll in a course (requires subscription).

**Auth Required:** Yes

**Guards:** JwtAuthGuard, SubscriptionGuard

**Request Body:**
```json
{
  "courseId": "uuid-v4"
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "userId": "uuid-v4",
  "courseId": "uuid-v4",
  "enrolledAt": "2026-02-05T10:00:00.000Z",
  "completedAt": null,
  "progress": 0,
  "lastAccessedAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/academy/enrollments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"courseId": "uuid-v4"}'
```

**Error Codes:**
- `400` - Course not published
- `403` - Subscription required (EDUCATION tier or higher)
- `404` - Course not found
- `409` - Already enrolled in this course

---

### GET /academy/enrollments

Get authenticated user's enrollments.

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): IN_PROGRESS, COMPLETED
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "courseId": "uuid-v4",
    "enrolledAt": "2026-02-01T10:00:00.000Z",
    "progress": 45,
    "lastAccessedAt": "2026-02-05T09:30:00.000Z",
    "course": {
      "id": "uuid-v4",
      "title": "Real Estate Basics for Beginners",
      "thumbnailUrl": "https://res.cloudinary.com/...",
      "lessonCount": 24
    }
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/academy/enrollments \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### GET /academy/enrollments/:id

Get enrollment detail with progress.

**Auth Required:** Yes

**Response (200):**
```json
{
  "id": "uuid-v4",
  "courseId": "uuid-v4",
  "progress": 45,
  "enrolledAt": "2026-02-01T10:00:00.000Z",
  "course": {
    "title": "Real Estate Basics for Beginners",
    "modules": [...]
  },
  "lessonProgress": [
    {
      "lessonId": "uuid-v4",
      "completed": true,
      "completedAt": "2026-02-01T11:30:00.000Z"
    }
  ]
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/academy/enrollments/uuid-v4 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🤝 Community Module

### GET /community/events

List all published events.

**Query Parameters:**
- `type` (optional): WORKSHOP, NETWORKING, CONFERENCE, WEBINAR, MEETUP
- `format` (optional): ONLINE, OFFLINE
- `category` (optional): REAL_ESTATE, FINANCIAL, BOTH
- `upcoming` (optional): true (only future events)
- `search` (optional): Search in title/description
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid-v4",
      "slug": "real-estate-networking-prague",
      "title": "Real Estate Networking - Prague",
      "description": "Join us for an evening of networking...",
      "type": "NETWORKING",
      "format": "OFFLINE",
      "category": "REAL_ESTATE",
      "bannerImage": "https://res.cloudinary.com/...",
      "startDate": "2026-03-15T18:00:00.000Z",
      "endDate": "2026-03-15T21:00:00.000Z",
      "location": "Prague",
      "address": "Wenceslas Square 1, Prague 1",
      "maxAttendees": 50,
      "attendeeCount": 32,
      "price": 0,
      "status": "PUBLISHED",
      "published": true,
      "featured": true,
      "organizer": {
        "id": "uuid-v4",
        "name": "Marie Nováková"
      }
    }
  ],
  "total": 8,
  "page": 1,
  "limit": 10
}
```

**Example curl:**
```bash
curl -X GET "http://localhost:3001/api/community/events?type=NETWORKING&upcoming=true"
```

---

### GET /community/events/:slug

Get detailed event information.

**Response (200):**
```json
{
  "id": "uuid-v4",
  "slug": "real-estate-networking-prague",
  "title": "Real Estate Networking - Prague",
  "description": "Join us for an evening of networking with top real estate professionals...",
  "type": "NETWORKING",
  "format": "OFFLINE",
  "category": "REAL_ESTATE",
  "startDate": "2026-03-15T18:00:00.000Z",
  "endDate": "2026-03-15T21:00:00.000Z",
  "timezone": "Europe/Prague",
  "location": "Prague",
  "address": "Wenceslas Square 1, Prague 1",
  "latitude": 50.0813,
  "longitude": 14.4264,
  "maxAttendees": 50,
  "attendeeCount": 32,
  "price": 0,
  "tags": ["networking", "real-estate", "prague"],
  "organizer": {
    "id": "uuid-v4",
    "name": "Marie Nováková",
    "email": "marie@example.com"
  }
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/community/events/real-estate-networking-prague
```

---

### POST /community/events/:eventId/rsvp

RSVP to an event.

**Auth Required:** Yes

**Request Body:**
```json
{
  "notes": "Looking forward to meeting everyone!"
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "userId": "uuid-v4",
  "eventId": "uuid-v4",
  "status": "PENDING",
  "notes": "Looking forward to meeting everyone!",
  "rsvpedAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/community/events/uuid-v4/rsvp \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "Looking forward to meeting everyone!"}'
```

**Error Codes:**
- `400` - Event not published or at capacity
- `404` - Event not found
- `409` - Already registered for this event

---

### GET /community/rsvps/my

Get authenticated user's RSVPs.

**Auth Required:** Yes

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "eventId": "uuid-v4",
    "status": "CONFIRMED",
    "notes": "Looking forward to it!",
    "rsvpedAt": "2026-02-05T10:00:00.000Z",
    "event": {
      "id": "uuid-v4",
      "title": "Real Estate Networking - Prague",
      "startDate": "2026-03-15T18:00:00.000Z",
      "format": "OFFLINE",
      "location": "Prague"
    }
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/community/rsvps/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### PATCH /community/rsvps/:id/cancel

Cancel RSVP.

**Auth Required:** Yes

**Response (200):**
```json
{
  "message": "RSVP cancelled successfully"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/community/rsvps/uuid-v4/cancel \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💎 Subscriptions Module

### GET /subscriptions/my

Get authenticated user's subscriptions.

**Auth Required:** Yes

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "userId": "uuid-v4",
    "subscriptionType": "MARKETPLACE",
    "status": "ACTIVE",
    "currentPeriodStart": "2026-02-01T00:00:00.000Z",
    "currentPeriodEnd": "2026-03-01T00:00:00.000Z",
    "canceledAt": null,
    "createdAt": "2026-02-01T00:00:00.000Z"
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/subscriptions/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /subscriptions/education/checkout

Create Stripe checkout session for Education subscription.

**Auth Required:** Yes

**Response (200):**
```json
{
  "sessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0",
  "url": "https://checkout.stripe.com/pay/cs_test_a1B2c3D4e5F6g7H8i9J0"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/subscriptions/education/checkout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Note:** Redirect user to the `url` to complete payment.

---

### POST /subscriptions/marketplace/checkout

Create Stripe checkout session for Marketplace subscription.

**Auth Required:** Yes

**Response (200):**
```json
{
  "sessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0",
  "url": "https://checkout.stripe.com/pay/cs_test_a1B2c3D4e5F6g7H8i9J0"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/subscriptions/marketplace/checkout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /subscriptions/premium/checkout

Create Stripe checkout session for Premium subscription.

**Auth Required:** Yes

**Response (200):**
```json
{
  "sessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0",
  "url": "https://checkout.stripe.com/pay/cs_test_a1B2c3D4e5F6g7H8i9J0"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/subscriptions/premium/checkout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /subscriptions/:id/cancel

Cancel subscription (will remain active until period end).

**Auth Required:** Yes

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "ACTIVE",
  "canceledAt": "2026-02-05T10:00:00.000Z",
  "currentPeriodEnd": "2026-03-01T00:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/subscriptions/uuid-v4/cancel \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /subscriptions/:id/resume

Resume cancelled subscription.

**Auth Required:** Yes

**Response (200):**
```json
{
  "id": "uuid-v4",
  "status": "ACTIVE",
  "canceledAt": null,
  "currentPeriodEnd": "2026-03-01T00:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/subscriptions/uuid-v4/resume \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### GET /subscriptions/portal

Get Stripe customer portal URL for managing subscription.

**Auth Required:** Yes

**Response (200):**
```json
{
  "url": "https://billing.stripe.com/p/session/test_abc123"
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/subscriptions/portal \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📧 Reviews Module

### POST /reviews

Create a review for a specialist (public endpoint).

**Request Body:**
```json
{
  "specialistId": "uuid-v4",
  "customerName": "Petra Svobodová",
  "customerEmail": "petra@example.com",
  "rating": 5,
  "comment": "Excellent service! Very professional and helpful."
}
```

**Response (201):**
```json
{
  "id": "uuid-v4",
  "specialistId": "uuid-v4",
  "customerName": "Petra Svobodová",
  "rating": 5,
  "comment": "Excellent service! Very professional and helpful.",
  "verified": false,
  "createdAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "specialistId": "uuid-v4",
    "customerName": "Petra Svobodová",
    "customerEmail": "petra@example.com",
    "rating": 5,
    "comment": "Excellent service!"
  }'
```

**Validation:**
- `rating`: Must be 1-5

---

### GET /reviews/:specialistId

Get all reviews for a specialist.

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "customerName": "Petra Svobodová",
    "rating": 5,
    "comment": "Excellent service! Very professional and helpful.",
    "verified": true,
    "response": "Thank you for your kind words!",
    "respondedAt": "2026-02-05T12:00:00.000Z",
    "createdAt": "2026-02-05T10:00:00.000Z"
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/reviews/uuid-v4
```

---

### GET /reviews/my/all

Get all reviews for authenticated specialist.

**Auth Required:** Yes (Specialist only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "customerName": "Petra Svobodová",
    "customerEmail": "petra@example.com",
    "rating": 5,
    "comment": "Excellent service!",
    "verified": true,
    "response": null,
    "createdAt": "2026-02-05T10:00:00.000Z"
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/reviews/my/all \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### POST /reviews/:id/respond

Respond to a review (specialist only).

**Auth Required:** Yes (Specialist, owner only)

**Request Body:**
```json
{
  "response": "Thank you for your kind words! It was a pleasure working with you."
}
```

**Response (200):**
```json
{
  "id": "uuid-v4",
  "response": "Thank you for your kind words! It was a pleasure working with you.",
  "respondedAt": "2026-02-05T12:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X POST http://localhost:3001/api/reviews/uuid-v4/respond \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"response": "Thank you for your kind words!"}'
```

---

## 🔧 Admin Module

### GET /admin/stats

Get platform statistics (admin only).

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
{
  "totalUsers": 324,
  "totalSpecialists": 156,
  "verifiedSpecialists": 98,
  "totalLeads": 1247,
  "totalDeals": 876,
  "closedWonDeals": 234,
  "totalCommissions": 234,
  "pendingCommissions": 12,
  "totalRevenue": 12450000,
  "monthlyRevenue": 1850000
}
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

---

### GET /admin/specialists

Get all specialists (admin only).

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "userId": "uuid-v4",
    "slug": "jan-novak",
    "category": "REAL_ESTATE",
    "location": "Praha",
    "verified": true,
    "subscriptionTier": "MARKETPLACE",
    "user": {
      "id": "uuid-v4",
      "email": "jan.novak@example.com",
      "name": "Jan Novák",
      "createdAt": "2026-01-01T10:00:00.000Z"
    }
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/admin/specialists \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

---

### PATCH /admin/specialists/:id/verify

Verify a specialist (admin only).

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
{
  "id": "uuid-v4",
  "verified": true,
  "updatedAt": "2026-02-05T10:00:00.000Z"
}
```

**Example curl:**
```bash
curl -X PATCH http://localhost:3001/api/admin/specialists/uuid-v4/verify \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

---

### GET /admin/leads

Get all leads (admin only).

**Auth Required:** Yes (Admin only)

**Response (200):**
```json
[
  {
    "id": "uuid-v4",
    "specialistId": "uuid-v4",
    "customerName": "Petra Svobodová",
    "customerEmail": "petra@example.com",
    "status": "QUALIFIED",
    "createdAt": "2026-02-01T10:00:00.000Z",
    "specialist": {
      "id": "uuid-v4",
      "user": {
        "name": "Jan Novák"
      }
    }
  }
]
```

**Example curl:**
```bash
curl -X GET http://localhost:3001/api/admin/leads \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

---

## 📐 Common Schemas

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'CUSTOMER' | 'SPECIALIST' | 'ADMIN';
  verified: boolean;
  subscriptionType: 'NONE' | 'EDUCATION' | 'MARKETPLACE' | 'PREMIUM';
  educationSubscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Specialist

```typescript
interface Specialist {
  id: string;
  userId: string;
  slug: string;
  category: 'REAL_ESTATE' | 'FINANCIAL';
  location: string;
  bio?: string;
  yearsExperience: number;
  verified: boolean;
  hourlyRate?: number;
  rating: number;
  reviewCount: number;
  profilePhoto?: string;
  services?: string[];
  certifications?: string[];
  education?: string;
  website?: string;
  linkedin?: string;
  availability?: string[];
  subscriptionTier?: 'EDUCATION' | 'MARKETPLACE' | 'PREMIUM';
  createdAt: Date;
  updatedAt: Date;
}
```

### Deal

```typescript
interface Deal {
  id: string;
  specialistId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  message: string;
  status: DealStatus;
  dealValue?: number;
  estimatedCloseDate?: Date;
  actualCloseDate?: Date;
  notes: string[];
  gdprConsent: boolean;
  commissionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum DealStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  IN_PROGRESS = 'in_progress',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}
```

### DealEvent

```typescript
interface DealEvent {
  id: string;
  leadId: string;
  type: 'CREATED' | 'STATUS_CHANGED' | 'NOTE_ADDED' | 'EMAIL_SENT';
  data?: Record<string, any>;
  createdAt: Date;
}
```

**Event Data Examples:**

```typescript
// STATUS_CHANGED
{
  "from": "NEW",
  "to": "CONTACTED"
}

// NOTE_ADDED
{
  "note": "Customer called back"
}

// EMAIL_SENT
{
  "subject": "Deal status update",
  "recipient": "customer@example.com"
}
```

### DealAnalyticsData

```typescript
interface DealAnalyticsData {
  conversionRate: number;        // Percentage (0-100)
  averageDealValue: number;      // CZK
  averageTimeToClose: number;    // Days
  winRate: number;               // Percentage (0-100)
  statusDistribution: Array<{
    status: DealStatus;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;               // Format: "YYYY-MM"
    won: number;
    lost: number;
  }>;
}
```

### Commission

```typescript
interface Commission {
  id: string;
  dealId: string;
  specialistId: string;
  dealValue: number;             // CZK
  commissionRate: number;        // 0.15 = 15%
  commissionAmount: number;      // Calculated: dealValue * commissionRate
  status: 'PENDING' | 'INVOICED' | 'PAID' | 'WAIVED';
  calculatedAt: Date;
  dueDate: Date;                 // Typically 30 days after close
  invoicedAt?: Date;
  paidAt?: Date;
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Course

```typescript
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: 'REAL_ESTATE' | 'FINANCIAL' | 'BOTH';
  instructorName: string;
  instructorBio: string;
  instructorPhoto: string;
  duration: number;              // Total minutes
  moduleCount: number;
  lessonCount: number;
  enrollmentCount: number;
  rating: number;                // 0-5
  reviewCount: number;
  published: boolean;
  featured: boolean;
  position: number;
  modules?: Module[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Event

```typescript
interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'WORKSHOP' | 'NETWORKING' | 'CONFERENCE' | 'WEBINAR' | 'MEETUP';
  format: 'ONLINE' | 'OFFLINE';
  category: 'REAL_ESTATE' | 'FINANCIAL' | 'BOTH';
  bannerImage?: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  location?: string;             // For offline events
  address?: string;              // For offline events
  latitude?: number;
  longitude?: number;
  meetingLink?: string;          // For online events
  meetingPassword?: string;      // For online events
  organizerId: string;
  maxAttendees?: number;         // null = unlimited
  attendeeCount: number;
  price: number;                 // 0 = free
  currency: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  published: boolean;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Subscription

```typescript
interface Subscription {
  id: string;
  specialistId?: string;
  userId?: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  subscriptionType: 'EDUCATION' | 'MARKETPLACE' | 'PREMIUM';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID' | 'TRIALING';
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  canceledAt?: Date;
  scheduledDowngradeTo?: 'EDUCATION' | 'MARKETPLACE' | 'PREMIUM';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ⚠️ Error Handling

### Standard Error Response

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid input |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource (e.g., email already exists) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Validation Errors

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

---

## 🔒 Authorization

### Roles

| Role | Description |
|------|-------------|
| CUSTOMER | Default role for regular users (can create leads/reviews) |
| SPECIALIST | Professional user with specialist profile |
| ADMIN | Platform administrator with full access |

### Guards

**JwtAuthGuard**
- Requires valid JWT token in Authorization header
- Usage: `@UseGuards(JwtAuthGuard)`

**AdminGuard**
- Requires admin role
- Usage: `@UseGuards(JwtAuthGuard, AdminGuard)`

**SubscriptionGuard**
- Requires specific subscription tier
- Used for Academy enrollment
- Usage: `@UseGuards(JwtAuthGuard, SubscriptionGuard)`

**LeadLimitGuard**
- Rate limits lead/deal creation
- Prevents spam
- Usage: `@UseGuards(LeadLimitGuard)`

### Subscription Tiers

| Tier | Features |
|------|----------|
| EDUCATION | Access to Academy courses and learning materials |
| MARKETPLACE | Access to Deals, Commissions, and marketplace features |
| PREMIUM | All features including VIP support and analytics |

**Access Matrix:**

| Feature | EDUCATION | MARKETPLACE | PREMIUM |
|---------|-----------|-------------|---------|
| Academy Courses | ✓ | ✗ | ✓ |
| Deals & Commissions | ✗ | ✓ | ✓ |
| Community Events | ✓ | ✓ | ✓ |
| Analytics Dashboard | ✗ | ✗ | ✓ |
| Priority Support | ✗ | ✗ | ✓ |

---

## 📝 Rate Limiting

### Endpoint Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| General endpoints | 100 requests | 15 minutes |
| Auth endpoints | 10 requests | 15 minutes |
| Lead creation | 5 requests | 1 hour |
| Deal creation | 5 requests | 1 hour |
| Payment endpoints | 20 requests | 1 hour |

### Rate Limit Headers

When rate limited, responses include:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1738752000
```

### Rate Limit Error

```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Rate limit exceeded. Please try again later."
}
```

---

## 🧪 Testing

### Using curl

**Set environment variable for token:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Test authenticated endpoint:**
```bash
curl -X GET http://localhost:3001/api/specialists/me/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Test POST with JSON:**
```bash
curl -X POST http://localhost:3001/api/deals \
  -H "Content-Type: application/json" \
  -d @deal.json
```

### Using Postman

1. Import the Postman collection (if available)
2. Set environment variables:
   - `BASE_URL`: `http://localhost:3001/api`
   - `ACCESS_TOKEN`: Your JWT token
3. Use `{{BASE_URL}}` and `{{ACCESS_TOKEN}}` in requests

**Environment Setup:**
```json
{
  "BASE_URL": "http://localhost:3001/api",
  "ACCESS_TOKEN": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using Swagger UI

1. Navigate to `http://localhost:3001/api/docs`
2. Click the "Authorize" button (top right)
3. Enter your JWT token: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Click "Authorize"
5. Try endpoints interactively by clicking "Try it out"

**Benefits:**
- Interactive API exploration
- Automatic request/response validation
- Schema documentation
- Example values

### Testing Webhooks

**Stripe Webhook (local testing):**

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

---

## 🔄 Webhook Endpoints

### POST /stripe/webhook

Handles Stripe webhook events (public endpoint with signature validation).

**Events Handled:**
- `checkout.session.completed` - Subscription created
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription cancelled

**Headers:**
```
stripe-signature: t=1492774577,v1=5257a...
```

**Note:** This endpoint validates Stripe signatures. Do not call directly.

---

**API Version:** 1.0
**Last Updated:** 2026-02-05
**Backend Framework:** NestJS 11
**Database:** PostgreSQL 15
**Authentication:** JWT (jsonwebtoken)
**Payment Processing:** Stripe API
**File Storage:** Cloudinary
**Email Service:** Configured SMTP

---

## 📞 Support

For API support or questions:
- Email: dev@tvujspecialista.cz
- Documentation: https://docs.tvujspecialista.cz
- Issues: https://github.com/tvujspecialista/backend/issues

---

**Note:** This documentation reflects Phase 3 implementation including Deal Events Timeline and Analytics features. All endpoints are tested and production-ready.
