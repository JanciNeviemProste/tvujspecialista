# Production Deployment Checklist

## Pre-Deployment

### Backend Configuration
- [ ] Environment variables set in production
- [ ] Database connection string configured
- [ ] Database migrations run
- [ ] Stripe webhooks configured
- [ ] SendGrid templates uploaded
- [ ] Cloudinary bucket configured
- [ ] JWT secrets are strong (32+ chars)

### Security
- [ ] AdminGuard on all admin endpoints (US-1 completed)
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers configured

### Payment System
- [ ] Stripe price IDs configured (see STRIPE_CONFIGURATION.md)
- [ ] Stripe webhook endpoint registered
- [ ] Test payment with real card in test mode
- [ ] Verify commission calculation (10% fee)
- [ ] Commission payment flow tested (US-2 completed)

### Testing
- [ ] All unit tests passing (67 tests from US-4)
- [ ] Payment flow tested end-to-end
- [ ] Subscription checkout tested
- [ ] Email delivery tested (SendGrid)
- [ ] AdminGuard authorization tested

## Deployment Steps

### Database
- [ ] Backup current database
- [ ] Run migrations: `npm run migration:run`
- [ ] Verify data integrity
- [ ] Seed initial data if needed

### Backend
- [ ] Install dependencies: `npm install`
- [ ] Build backend: `npm run build`
- [ ] Deploy to server (Heroku/AWS/DigitalOcean)
- [ ] Verify health endpoint: `/api/health`
- [ ] Check logs for errors
- [ ] Test API endpoints

### Frontend
- [ ] Install dependencies: `npm install`
- [ ] Build frontend: `npm run build`
- [ ] Deploy to hosting (Vercel/Netlify/CDN)
- [ ] Verify routes work
- [ ] Test dark mode toggle
- [ ] Check console for errors

## Post-Deployment Verification

### Critical Flows
- [ ] Test login flow
- [ ] Test registration flow
- [ ] Create test deal
- [ ] Close deal (generates commission)
- [ ] Pay test commission (Stripe CardElement)
- [ ] Subscribe to test tier (Education/Marketplace/Premium)
- [ ] Verify emails sent (welcome, confirmation, receipt)
- [ ] Test admin access to pending commissions
- [ ] Test commission waive (admin only)

### Monitoring
- [ ] Set up error alerts (Sentry/Rollbar)
- [ ] Monitor Stripe dashboard
- [ ] Check server metrics (CPU, memory, disk)
- [ ] Review logs for errors
- [ ] Monitor database connections

### Performance
- [ ] Check page load times
- [ ] Verify API response times < 200ms
- [ ] Test under load (if expected traffic is high)
- [ ] Monitor memory usage

## Rollback Plan

If critical issues are found:

1. **Frontend Rollback:**
   - Revert to previous deployment in hosting dashboard
   - Clear CDN cache if needed

2. **Backend Rollback:**
   - Revert to previous Git commit
   - Redeploy previous version
   - Run migrations down if needed: `npm run migration:revert`

3. **Database Rollback:**
   - Restore from backup
   - Verify data integrity after restore

## Post-Launch

### Week 1
- [ ] Monitor error rates daily
- [ ] Check payment success rates
- [ ] Review user feedback
- [ ] Monitor performance metrics
- [ ] Check email delivery rates

### Month 1
- [ ] Analyze usage patterns
- [ ] Review commission payments
- [ ] Check subscription conversions
- [ ] Optimize slow queries
- [ ] Update documentation

## Support Contacts

- **Stripe Support:** https://support.stripe.com
- **SendGrid Support:** https://support.sendgrid.com
- **Cloudinary Support:** https://support.cloudinary.com

## Configuration References

- Stripe Setup: See `STRIPE_CONFIGURATION.md`
- Backend .env: See `backend/.env.example`
- Frontend .env: See `.env.example`

## Completion Checklist

Sprint 1 (Phase 1) deliverables:
- [x] US-1: AdminGuard on commission endpoints
- [x] US-2: Stripe payment UI implemented
- [x] US-3: Toast notifications (in progress)
- [x] US-4: Critical payment tests (67 tests passing)
- [x] US-5: Stripe configuration documented
- [ ] US-6: Deployment checklist (this document)

---

**Checklist Version:** 1.0
**Last Updated:** 2026-02-05
**Sprint:** Phase 1 Critical Fixes
