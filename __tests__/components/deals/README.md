# DealTimeline Component Tests

## Overview
Komplexné unit testy pre komponent `DealTimeline.tsx`, ktorý zobrazuje časovú os udalostí pre obchodnú príležitosť (deal).

## Test Coverage (15 testov)

### 1. Rendering Tests (3 testy)
- ✅ Renders timeline with events
- ✅ Shows loading skeleton when isLoading=true
- ✅ Shows empty state when no events

### 2. Event Type Tests (4 testy)
- ✅ Renders CREATED event correctly (blue color, Circle icon)
- ✅ Renders STATUS_CHANGED event (green color, ArrowRight icon)
- ✅ Renders NOTE_ADDED event (purple color, MessageSquare icon)
- ✅ Renders EMAIL_SENT event (orange color, Mail icon)

### 3. Chronological Order Test (1 test)
- ✅ Displays events in the order provided (expects pre-sorted data)

### 4. Date Formatting Tests (2 testy)
- ✅ Formats dates correctly (Slovak locale)
- ✅ Shows formatted time with hours and minutes

### 5. Metadata Handling Tests (3 testy)
- ✅ Shows old and new status for STATUS_CHANGED
- ✅ Shows note content for NOTE_ADDED
- ✅ Shows email information for EMAIL_SENT

### 6. Accessibility Tests (2 testy)
- ✅ Has proper ARIA labels (role="list", aria-label)
- ✅ Uses semantic HTML (<ol>, <li>, <time>)

### 7. Edge Cases (7 dodatočných testov)
- ✅ Handles undefined events gracefully
- ✅ Handles single event
- ✅ Handles unknown event type with default styling
- ✅ Renders vertical line between events (except last)
- ✅ Applies custom className to timeline
- ✅ Applies custom className to loading state
- ✅ Applies custom className to empty state

## Running Tests

### Run all tests
```bash
npm test
```

### Run DealTimeline tests only
```bash
npm test DealTimeline
```

### Watch mode (re-run on file changes)
```bash
npm test:watch DealTimeline
```

### Coverage report
```bash
npm test:coverage
```

## Test Structure

```typescript
describe('DealTimeline', () => {
  // Mock data helpers
  const createMockEvent = (type, description, createdAt, metadata) => {...}

  describe('Rendering tests', () => {...})
  describe('Event type tests', () => {...})
  describe('Chronological order test', () => {...})
  describe('Date formatting tests', () => {...})
  describe('Metadata handling tests', () => {...})
  describe('Accessibility tests', () => {...})
  describe('Edge cases', () => {...})
})
```

## Mocked Dependencies

### Libraries
- `@testing-library/react` - Rendering and DOM queries
- `@testing-library/jest-dom` - Custom matchers

### External Modules
- `@/lib/utils/format` - Date formatting utilities
- `lucide-react` - Icon components (Circle, ArrowRight, MessageSquare, Mail, Clock, DollarSign)

### Utilities
- `@/lib/utils/cn` - Class name utilities (via tailwind-merge)

## Component Props

```typescript
interface DealTimelineProps {
  events: DealEvent[];
  isLoading?: boolean;
  className?: string;
}

interface DealEvent {
  id: string;
  dealId: string;
  type: string;
  description: string;
  metadata?: any;
  createdAt: string;
}
```

## Event Types & Styling

| Type | Icon | Color | Background |
|------|------|-------|------------|
| `created` | Circle | Blue (`text-blue-500`) | `bg-blue-500/10` |
| `status_changed` | ArrowRight | Green (`text-green-500`) | `bg-green-500/10` |
| `note_added` | MessageSquare | Purple (`text-purple-500`) | `bg-purple-500/10` |
| `email_sent` | Mail | Orange (`text-orange-500`) | `bg-orange-500/10` |
| `value` | DollarSign | Purple (`text-purple-500`) | `bg-purple-500/10` |
| Unknown | Circle | Gray (`text-gray-500`) | `bg-gray-500/10` |

## Test Data Examples

### CREATED Event
```typescript
{
  id: 'event-1',
  dealId: 'deal-123',
  type: 'created',
  description: 'Deal created',
  createdAt: '2024-01-15T10:00:00Z'
}
```

### STATUS_CHANGED Event
```typescript
{
  id: 'event-2',
  dealId: 'deal-123',
  type: 'status_changed',
  description: 'Status changed from NEW to CONTACTED',
  metadata: {
    oldStatus: 'NEW',
    newStatus: 'CONTACTED'
  },
  createdAt: '2024-01-15T11:00:00Z'
}
```

### NOTE_ADDED Event
```typescript
{
  id: 'event-3',
  dealId: 'deal-123',
  type: 'note_added',
  description: 'Note: Customer interested in premium package',
  metadata: {
    note: 'Customer interested in premium package'
  },
  createdAt: '2024-01-15T12:00:00Z'
}
```

### EMAIL_SENT Event
```typescript
{
  id: 'event-4',
  dealId: 'deal-123',
  type: 'email_sent',
  description: 'Email sent to customer',
  metadata: {
    emailType: 'follow_up'
  },
  createdAt: '2024-01-15T13:00:00Z'
}
```

## Accessibility Features Tested

1. **Semantic HTML**
   - Uses `<ol>` for ordered timeline
   - Uses `<li>` for individual events
   - Uses `<time>` with `datetime` attribute

2. **ARIA Attributes**
   - `role="list"` on timeline
   - `aria-label="Deal timeline"` for screen readers
   - `aria-hidden="true"` on decorative icons and lines

3. **Visual Indicators**
   - Color-coded events with sufficient contrast
   - Icon indicators for event types
   - Vertical line connecting events

## Notes

- Testy očakávajú, že udalosti sú už zoradené (najnovšie prvé)
- Komponenta používa Slovak locale pre formátovanie dátumov (`sk-SK`)
- Loading state zobrazuje 3 skeleton items
- Empty state zobrazuje Clock icon a správu "Zatiaľ žiadne udalosti"
- Vertical line sa nezobrazuje pri poslednom evente

## Troubleshooting

### Icon not rendering
Skontrolujte, či je `lucide-react` správne namockovaný v teste.

### Date format issues
Skontrolujte, že `formatDateTime` funkcia používa správne locale (`sk` pre slovenčinu).

### Styling tests failing
Skontrolujte, že `cn` utility a Tailwind classes sú správne nastavené.

## Future Improvements

- [ ] Pridať testy pre relative time ("pred 2 hodinami")
- [ ] Pridať testy pre user interactions (expand/collapse)
- [ ] Pridať testy pre filtering events by type
- [ ] Pridať snapshot tests pre visual regression
- [ ] Pridať performance tests pre veľké množstvo eventov (100+)
