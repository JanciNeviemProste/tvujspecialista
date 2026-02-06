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
- [ ] Enhanced deal filters tested (value range, date range)
- [ ] Deal activity timeline tested (all event types)
- [ ] Email notifications tested (status changes, value set, deadline reminders)
- [ ] Deal analytics dashboard tested (all metrics)
- [ ] CSV export tested (format, encoding, filtering)

## Phase 3: Enhanced Features Testing

### Enhanced Filters Testing (US-1)
- [ ] Value range slider adjusts from 0 to max deal value
- [ ] Date range picker filters by creation date
- [ ] Date range picker filters by estimated close date
- [ ] Multiple filters work together (search + status + value + date)
- [ ] Clear filters button resets all filters
- [ ] Filter state persists during session
- [ ] Filtered deal count updates correctly

### Deal Timeline Testing (US-2)
- [ ] Open deal detail modal, timeline is visible
- [ ] Events shown in chronological order (newest first)
- [ ] CREATED event displays correctly
- [ ] STATUS_CHANGED event shows old/new status
- [ ] NOTE_ADDED event displays note content
- [ ] VALUE_SET event shows deal value
- [ ] Icons render for each event type
- [ ] Empty state when no events
- [ ] Timeline scrollable with many events

### Email Notifications Testing (US-3)
- [ ] Change deal status → email received (Slovak language)
- [ ] Set deal value → email received with value
- [ ] Deal approaching deadline (3 days) → reminder email sent
- [ ] Email HTML template renders correctly
- [ ] SendGrid logs show successful delivery
- [ ] Email contains correct deal information
- [ ] Cron job runs daily at 9 AM for deadline reminders

### Analytics Dashboard Testing (US-4)
- [ ] Analytics section displays on deals page
- [ ] Conversion rate calculated correctly
- [ ] Average deal value shown (EUR formatting)
- [ ] Average time to close displayed (days)
- [ ] Win rate percentage correct
- [ ] Status distribution bars display proportionally
- [ ] Monthly trend shows last 6 months
- [ ] Analytics work in dark mode
- [ ] Empty state when no deals
- [ ] Analytics refresh after deal changes

### CSV Export Testing (US-5)
- [ ] Click export button → CSV downloads immediately
- [ ] Filename format: `deals-YYYY-MM-DD.csv`
- [ ] All deal fields included (customer info, status, dates, values, notes count)
- [ ] Only filtered deals exported (respects current filters)
- [ ] Slovak date formatting (DD.MM.YYYY)
- [ ] EUR currency formatting with spaces
- [ ] UTF-8 BOM for Excel compatibility
- [ ] No encoding issues with special characters (č, ť, ž, etc.)
- [ ] Empty values handled correctly (no "undefined" or "null" strings)
- [ ] Export works with 0 deals (shows headers only)

### Performance Testing (Phase 4C)
- [ ] Shimmer loading animations display correctly
- [ ] Code splitting works (DealAnalytics, DealDetailModal lazy loaded)
- [ ] Performance metrics logged (filter, export operations)
- [ ] Error boundary catches and displays errors gracefully
- [ ] ARIA labels present on all interactive elements
- [ ] Database queries execute in <100ms (with indexes)
- [ ] Page load time <2s on 3G connection

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

### Phase 3 Deal Management Enhancements

#### Enhanced Deal Filters
- [ ] Search filter: Search by customer name
- [ ] Search filter: Search by customer email
- [ ] Search filter: Search by customer phone
- [ ] Search filter: Search works case-insensitive
- [ ] Status filter: Filter by NEW status
- [ ] Status filter: Filter by CONTACTED status
- [ ] Status filter: Filter by QUALIFIED status
- [ ] Status filter: Filter by PROPOSAL status
- [ ] Status filter: Filter by WON status
- [ ] Status filter: Filter by LOST status
- [ ] Value range filter: Set minimum value only
- [ ] Value range filter: Set maximum value only
- [ ] Value range filter: Set both min and max values
- [ ] Value range filter: Slider updates correctly with drag
- [ ] Value range filter: Manual input updates slider position
- [ ] Date range filter: Filter by creation date (from date only)
- [ ] Date range filter: Filter by creation date (to date only)
- [ ] Date range filter: Filter by creation date (both dates)
- [ ] Date range filter: Filter by estimated close date (from date only)
- [ ] Date range filter: Filter by estimated close date (to date only)
- [ ] Date range filter: Filter by estimated close date (both dates)
- [ ] Combined filters: Search + Status filters together
- [ ] Combined filters: Search + Value range filters together
- [ ] Combined filters: Status + Date range filters together
- [ ] Combined filters: All filters active simultaneously
- [ ] Clear filters: Button clears all active filters
- [ ] Clear filters: Resets to show all deals
- [ ] Filter persistence: State persists during session navigation
- [ ] Filter count: Shows correct number of filtered deals
- [ ] No results state: Displays when filters return no matches

#### Deal Activity Timeline
- [ ] Timeline visible: Opens in deal detail modal
- [ ] Timeline order: Events sorted newest first
- [ ] CREATED event: Displays with correct icon
- [ ] CREATED event: Shows creation timestamp
- [ ] STATUS_CHANGED event: Displays old status
- [ ] STATUS_CHANGED event: Displays new status
- [ ] STATUS_CHANGED event: Shows change timestamp
- [ ] STATUS_CHANGED event: Correct icon displayed
- [ ] NOTE_ADDED event: Displays note content
- [ ] NOTE_ADDED event: Shows note timestamp
- [ ] NOTE_ADDED event: Correct icon displayed
- [ ] VALUE_SET event: Displays deal value in EUR
- [ ] VALUE_SET event: Shows timestamp
- [ ] VALUE_SET event: Correct icon displayed
- [ ] Timeline scrolling: Scrollable with 10+ events
- [ ] Timeline empty state: Displays when no events exist
- [ ] Timeline formatting: Timestamps in readable format
- [ ] Timeline styling: Consistent with app theme
- [ ] Timeline dark mode: Displays correctly in dark mode

#### Email Notifications
- [ ] Status change email: Sent when status changes from NEW to CONTACTED
- [ ] Status change email: Sent when status changes to WON
- [ ] Status change email: Sent when status changes to LOST
- [ ] Status change email: Contains deal name
- [ ] Status change email: Contains old and new status
- [ ] Status change email: Contains customer information
- [ ] Status change email: Slovak language content
- [ ] Status change email: HTML template renders correctly
- [ ] Value set email: Sent when deal value is assigned
- [ ] Value set email: Contains deal value in EUR
- [ ] Value set email: Contains deal name
- [ ] Value set email: Slovak language content
- [ ] Deadline reminder email: Sent 3 days before deadline
- [ ] Deadline reminder email: Contains deal name
- [ ] Deadline reminder email: Contains deadline date
- [ ] Deadline reminder email: Contains customer information
- [ ] Deadline reminder email: Slovak language content
- [ ] Cron job: Runs daily at 9:00 AM UTC
- [ ] Cron job: Processes all deals with upcoming deadlines
- [ ] Email delivery: SendGrid logs show successful delivery
- [ ] Email delivery: No bounces or spam reports
- [ ] Email content: Links work correctly
- [ ] Email content: Formatting consistent across email clients

#### Deal Analytics Dashboard
- [ ] Analytics section: Visible on deals page
- [ ] Analytics section: Displays above deal list
- [ ] Conversion rate: Calculated correctly (WON / total deals)
- [ ] Conversion rate: Displayed as percentage
- [ ] Conversion rate: Updates when deals change
- [ ] Average deal value: Calculated from WON deals
- [ ] Average deal value: Formatted in EUR currency
- [ ] Average deal value: Displays 0 EUR when no WON deals
- [ ] Average time to close: Calculated in days
- [ ] Average time to close: Only includes WON deals
- [ ] Average time to close: Displays N/A when no WON deals
- [ ] Win rate: Calculated correctly (WON / (WON + LOST))
- [ ] Win rate: Displayed as percentage
- [ ] Win rate: Updates after status changes
- [ ] Status distribution: All statuses displayed
- [ ] Status distribution: Bar widths proportional to count
- [ ] Status distribution: Shows count for each status
- [ ] Status distribution: Color coded by status
- [ ] Monthly trend: Shows last 6 months
- [ ] Monthly trend: Displays deal count per month
- [ ] Monthly trend: Updates with new deals
- [ ] Analytics dark mode: All elements visible in dark mode
- [ ] Analytics empty state: Displays when no deals exist
- [ ] Analytics refresh: Updates after deal CRUD operations
- [ ] Analytics performance: Renders in <500ms with 100+ deals
- [ ] Analytics responsiveness: Mobile layout works correctly

#### CSV Export Functionality
- [ ] Export button: Visible and accessible
- [ ] Export button: Click triggers immediate download
- [ ] Filename format: Uses pattern `deals-YYYY-MM-DD.csv`
- [ ] Filename date: Matches current date
- [ ] CSV headers: All columns present (ID, Customer Name, Email, Phone, etc.)
- [ ] CSV headers: In correct order
- [ ] CSV data: All deal fields exported
- [ ] CSV data: Customer name included
- [ ] CSV data: Customer email included
- [ ] CSV data: Customer phone included
- [ ] CSV data: Deal status included
- [ ] CSV data: Deal value included (if set)
- [ ] CSV data: Creation date included
- [ ] CSV data: Estimated close date included (if set)
- [ ] CSV data: Notes count included
- [ ] Date formatting: Slovak format (DD.MM.YYYY)
- [ ] Currency formatting: EUR with proper spacing
- [ ] Status formatting: Readable status names
- [ ] UTF-8 BOM: Added for Excel compatibility
- [ ] Special characters: č, š, ž, ť, ý display correctly
- [ ] Special characters: ľ, ň, ď, ô, á, é, í display correctly
- [ ] Empty values: No "undefined" strings
- [ ] Empty values: No "null" strings
- [ ] Empty values: Empty cells for missing data
- [ ] Filter respect: Only filtered deals exported
- [ ] Filter respect: Export reflects current search filter
- [ ] Filter respect: Export reflects current status filter
- [ ] Filter respect: Export reflects current value range filter
- [ ] Filter respect: Export reflects current date range filter
- [ ] Zero deals: Headers-only CSV when no deals
- [ ] Large dataset: Export works with 500+ deals
- [ ] Excel compatibility: Opens correctly in Microsoft Excel
- [ ] Google Sheets compatibility: Opens correctly in Google Sheets
- [ ] LibreOffice compatibility: Opens correctly in LibreOffice Calc

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
- [x] US-3: Toast notifications
- [x] US-4: Critical payment tests (67 tests passing)
- [x] US-5: Stripe configuration documented
- [x] US-6: Deployment checklist (this document)

Sprint 2 (Phase 2) deliverables:
- [x] Deal management basic CRUD operations
- [x] Deal status workflow
- [x] Deal list view and filtering
- [x] Commission calculation integration

Sprint 3 (Phase 3) Deal Management Enhancements:
- [x] US-1: Enhanced Deal Filters (value range slider, date range picker)
- [x] US-2: Deal Activity Timeline (DealTimeline component with event types)
- [x] US-3: Email Notifications (status changes, value set, deadline reminders)
- [x] US-4: Deal Analytics Dashboard (conversion rate, avg value, time to close, win rate)
- [x] US-5: CSV Export (exportDealsToCSV utility with Slovak formatting)
- [x] US-6: Performance Optimizations (lazy loading, shimmer effects, error boundaries)

---

**Checklist Version:** 2.0
**Last Updated:** 2026-02-05
**Sprint:** Phase 3 Deal Management Enhancements
