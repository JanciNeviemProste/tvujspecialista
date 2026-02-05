# DealTimeline Test Examples - Príklady použitia

## Quick Start

```typescript
import { render, screen } from '@testing-library/react';
import { DealTimeline } from '@/components/deals/DealTimeline';
import { mockCompleteTimeline, mockEventTypes } from './mockData';

// Základný test
it('renders timeline', () => {
  render(<DealTimeline events={mockCompleteTimeline} isLoading={false} />);
  expect(screen.getByRole('list')).toBeInTheDocument();
});
```

## Príklady testov podľa scenára

### 1. Testovanie prázdneho stavu

```typescript
it('shows empty state message', () => {
  render(<DealTimeline events={[]} isLoading={false} />);

  expect(screen.getByText(/zatiaľ žiadne udalosti/i)).toBeInTheDocument();
  expect(screen.getByTestId('icon-clock')).toBeInTheDocument();
});
```

### 2. Testovanie loading stavu

```typescript
it('displays loading skeleton', () => {
  render(<DealTimeline events={[]} isLoading={true} />);

  // Očakáva 3 skeleton items
  const skeletons = document.querySelectorAll('.animate-pulse');
  expect(skeletons.length).toBeGreaterThan(0);
});
```

### 3. Testovanie konkrétneho typu eventu

```typescript
import { mockEventTypes } from './mockData';

it('renders created event with blue styling', () => {
  render(<DealTimeline events={[mockEventTypes.created]} isLoading={false} />);

  expect(screen.getByText('Deal created')).toBeInTheDocument();
  expect(screen.getByTestId('icon-circle')).toBeInTheDocument();

  const iconContainer = screen.getByTestId('icon-circle').parentElement;
  expect(iconContainer).toHaveClass('text-blue-500');
});
```

### 4. Testovanie viacerých eventov

```typescript
import { mockCompleteTimeline } from './mockData';

it('renders all events in timeline', () => {
  render(<DealTimeline events={mockCompleteTimeline} isLoading={false} />);

  const timeline = screen.getByRole('list');
  const items = within(timeline).getAllByRole('listitem');

  expect(items).toHaveLength(4); // 4 events
});
```

### 5. Testovanie metadát

```typescript
it('displays status change metadata', () => {
  const event = [{
    id: '1',
    dealId: 'deal-123',
    type: 'status_changed',
    description: 'Status changed from NEW to CONTACTED',
    metadata: {
      oldStatus: 'NEW',
      newStatus: 'CONTACTED'
    },
    createdAt: '2024-01-15T10:00:00Z'
  }];

  render(<DealTimeline events={event} isLoading={false} />);

  const description = screen.getByText(/NEW to CONTACTED/i);
  expect(description).toBeInTheDocument();
});
```

### 6. Testovanie formátovania dátumu

```typescript
it('formats date in Slovak locale', () => {
  const event = [{
    id: '1',
    dealId: 'deal-123',
    type: 'created',
    description: 'Deal created',
    createdAt: '2024-01-15T10:30:00Z'
  }];

  render(<DealTimeline events={event} isLoading={false} />);

  const timeElement = screen.getByText(/2024/).closest('time');
  expect(timeElement).toHaveAttribute('datetime', '2024-01-15T10:30:00Z');
  expect(timeElement?.textContent).toMatch(/\d{2}\.\d{2}\.\d{4}/);
});
```

### 7. Testovanie accessibility

```typescript
it('has proper accessibility attributes', () => {
  render(<DealTimeline events={mockCompleteTimeline} isLoading={false} />);

  // Role and label
  const timeline = screen.getByRole('list', { name: /deal timeline/i });
  expect(timeline).toHaveAttribute('aria-label', 'Deal timeline');

  // Icons are decorative
  const icons = document.querySelectorAll('[aria-hidden="true"]');
  expect(icons.length).toBeGreaterThan(0);
});
```

### 8. Testovanie custom className

```typescript
it('applies custom CSS class', () => {
  const { container } = render(
    <DealTimeline
      events={mockCompleteTimeline}
      isLoading={false}
      className="my-custom-class"
    />
  );

  expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
});
```

### 9. Testovanie edge cases

```typescript
it('handles undefined events', () => {
  // @ts-expect-error Testing edge case
  render(<DealTimeline events={undefined} isLoading={false} />);

  expect(screen.getByText(/zatiaľ žiadne udalosti/i)).toBeInTheDocument();
});

it('handles unknown event type', () => {
  const unknownEvent = [{
    id: '1',
    dealId: 'deal-123',
    type: 'unknown_type',
    description: 'Unknown event',
    createdAt: '2024-01-15T10:00:00Z'
  }];

  render(<DealTimeline events={unknownEvent} isLoading={false} />);

  // Should render with default Circle icon and gray color
  expect(screen.getByTestId('icon-circle')).toBeInTheDocument();
  const iconContainer = screen.getByTestId('icon-circle').parentElement;
  expect(iconContainer).toHaveClass('text-gray-500');
});
```

### 10. Testovanie vertical line

```typescript
it('shows vertical line between events', () => {
  const { container } = render(
    <DealTimeline events={mockCompleteTimeline} isLoading={false} />
  );

  // Should have N-1 vertical lines for N events
  const verticalLines = container.querySelectorAll('.absolute.left-4.top-10.bottom-0');
  expect(verticalLines).toHaveLength(mockCompleteTimeline.length - 1);
});
```

## Použitie mock dát

### Import specific event types

```typescript
import { mockEventTypes } from './mockData';

// Use individual event types
const createdEvent = [mockEventTypes.created];
const statusEvent = [mockEventTypes.statusChanged];
const noteEvent = [mockEventTypes.noteAdded];
const emailEvent = [mockEventTypes.emailSent];
```

### Import prepared timelines

```typescript
import {
  mockCompleteTimeline,      // Full timeline (4 events)
  mockSingleEvent,           // Single event
  mockEmptyTimeline,         // Empty array
  mockMultipleStatusChanges, // Status progression
  mockMultipleNotes,         // Multiple notes
  mockEmailTimeline,         // Email communication
} from './mockData';
```

### Create custom mock data

```typescript
import { createMockEvent } from './mockData';

const customEvent = createMockEvent(
  'custom_type',
  'Custom event description',
  '2024-01-15T15:00:00Z',
  { customData: 'value' }
);

render(<DealTimeline events={[customEvent]} isLoading={false} />);
```

### Generate large dataset for performance testing

```typescript
import { createLargeTimeline } from './mockData';

it('handles large number of events', () => {
  const largeTimeline = createLargeTimeline(100); // 100 events

  render(<DealTimeline events={largeTimeline} isLoading={false} />);

  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(100);
});
```

## Komplexné test scenáre

### Full timeline workflow test

```typescript
import { mockMultipleStatusChanges } from './mockData';

it('displays complete deal lifecycle', () => {
  render(<DealTimeline events={mockMultipleStatusChanges} isLoading={false} />);

  // Check all status changes are present
  expect(screen.getByText(/NEW to CONTACTED/i)).toBeInTheDocument();
  expect(screen.getByText(/CONTACTED to QUALIFIED/i)).toBeInTheDocument();
  expect(screen.getByText(/QUALIFIED to IN_PROGRESS/i)).toBeInTheDocument();
  expect(screen.getByText(/IN_PROGRESS to CLOSED_WON/i)).toBeInTheDocument();

  // Verify chronological order
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(5); // 4 status changes + 1 created
});
```

### Email communication timeline

```typescript
import { mockEmailTimeline } from './mockData';

it('tracks email communication history', () => {
  render(<DealTimeline events={mockEmailTimeline} isLoading={false} />);

  expect(screen.getByText(/welcome email/i)).toBeInTheDocument();
  expect(screen.getByText(/proposal email/i)).toBeInTheDocument();
  expect(screen.getByText(/follow-up email/i)).toBeInTheDocument();

  // All should have Mail icon
  const mailIcons = screen.getAllByTestId('icon-mail');
  expect(mailIcons).toHaveLength(3);
});
```

### Notes timeline

```typescript
import { mockMultipleNotes } from './mockData';

it('displays all notes chronologically', () => {
  render(<DealTimeline events={mockMultipleNotes} isLoading={false} />);

  expect(screen.getByText(/Customer interested/i)).toBeInTheDocument();
  expect(screen.getByText(/Sent proposal/i)).toBeInTheDocument();
  expect(screen.getByText(/Deal closed/i)).toBeInTheDocument();

  // All notes should have MessageSquare icon
  const noteIcons = screen.getAllByTestId('icon-message-square');
  expect(noteIcons).toHaveLength(3);
});
```

## Debugging Tips

### 1. Zobrazenie aktuálneho DOM

```typescript
import { render, screen } from '@testing-library/react';

const { debug } = render(<DealTimeline events={mockEvents} isLoading={false} />);
debug(); // Vypíše celý DOM do konzoly
```

### 2. Zobrazenie konkrétneho elementu

```typescript
const timeline = screen.getByRole('list');
debug(timeline); // Vypíše len timeline element
```

### 3. Kontrola všetkých dostupných rolí

```typescript
screen.getByRole(''); // Vypíše všetky dostupné role v chybovej správe
```

### 4. Kontrola či element existuje (bez chyby)

```typescript
const element = screen.queryByText('Text that might not exist');
expect(element).toBeNull(); // alebo .toBeInTheDocument()
```

### 5. Asynchrónne čakanie na element

```typescript
const element = await screen.findByText('Async content');
expect(element).toBeInTheDocument();
```

## Common Pitfalls - Časté chyby

### ❌ Nesprávne - používanie container namiesto screen

```typescript
const { container } = render(<DealTimeline events={mockEvents} />);
const text = container.querySelector('.some-class'); // Lepšie je screen query
```

### ✅ Správne - používanie screen queries

```typescript
render(<DealTimeline events={mockEvents} isLoading={false} />);
const text = screen.getByText('Deal created'); // Accessibility-friendly
```

### ❌ Nesprávne - testovanie implementačných detailov

```typescript
expect(container.querySelector('.text-blue-500')).toBeInTheDocument();
```

### ✅ Správne - testovanie správania

```typescript
const icon = screen.getByTestId('icon-circle');
const iconContainer = icon.parentElement;
expect(iconContainer).toHaveClass('text-blue-500');
```

### ❌ Nesprávne - hardcoded očakávané hodnoty

```typescript
expect(items).toHaveLength(4); // Magic number
```

### ✅ Správne - používanie konštánt

```typescript
expect(items).toHaveLength(mockCompleteTimeline.length);
```

## Ďalšie zdroje

- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Vyhotovené:** 2026-02-05
