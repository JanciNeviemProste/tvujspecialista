# Setup Guide pre DealTimeline Testy

## Inštalácia Testing Dependencies

Pred spustením testov je potrebné nainštalovať nasledujúce závislosti:

```bash
npm install --save-dev jest @swc/jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

### Detailný zoznam závislostí

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "@swc/jest": "^0.2.29",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

## Konfigurácia

### 1. Jest Config (`jest.config.js`)

Konfigurácia už existuje v root adresári projektu:
- `C:\Users\janst\OneDrive\Počítač\tvujspecialista-main\jest.config.js`

### 2. Jest Setup (`jest.setup.js`)

Setup file už existuje v root adresári projektu:
- `C:\Users\janst\OneDrive\Počítač\tvujspecialista-main\jest.setup.js`

## Spustenie Testov

### Po nainštalovaní závislostí

```bash
# Spustiť všetky testy
npm test

# Spustiť len DealTimeline testy
npm test DealTimeline

# Watch mode (automatické spúšťanie pri zmene)
npm test:watch DealTimeline

# Coverage report
npm test:coverage
```

## Verifikácia Setup

Po nainštalovaní závislostí overte, že všetko funguje:

```bash
# Skontrolujte, že Jest je nainštalovaný
npx jest --version

# Spustite testy (mali by prejsť všetky)
npm test DealTimeline.test.tsx
```

## Očakávaný Výstup

Pri správnej konfigurácii by ste mali vidieť:

```
PASS  __tests__/components/deals/DealTimeline.test.tsx
  DealTimeline
    Rendering tests
      ✓ renders timeline with events (XX ms)
      ✓ shows loading skeleton when isLoading=true (XX ms)
      ✓ shows empty state when no events (XX ms)
    Event type tests
      ✓ renders CREATED event correctly (blue color, correct icon, description) (XX ms)
      ✓ renders STATUS_CHANGED event with old/new status (green color) (XX ms)
      ✓ renders NOTE_ADDED event with note text (purple color) (XX ms)
      ✓ renders EMAIL_SENT event (orange color) (XX ms)
    Chronological order test
      ✓ displays events in reverse chronological order (newest first) (XX ms)
    Date formatting tests
      ✓ formats dates correctly (Slovak locale) (XX ms)
      ✓ shows formatted time with hours and minutes (XX ms)
    Metadata handling tests
      ✓ shows old and new status for STATUS_CHANGED (XX ms)
      ✓ shows note content for NOTE_ADDED (XX ms)
      ✓ shows email type for EMAIL_SENT (XX ms)
    Accessibility tests
      ✓ has proper ARIA labels (role="list", aria-label) (XX ms)
      ✓ uses semantic HTML (<ol>, <li>, <time>) (XX ms)
    Edge cases
      ✓ handles undefined events gracefully (XX ms)
      ✓ handles single event (XX ms)
      ✓ handles unknown event type with default styling (XX ms)
      ✓ renders vertical line between events except for the last one (XX ms)
      ✓ applies custom className prop (XX ms)
      ✓ applies custom className to loading state (XX ms)
      ✓ applies custom className to empty state (XX ms)

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        X.XXs
```

## Troubleshooting

### Problem: "jest is not recognized"

**Riešenie:**
```bash
npm install --save-dev jest
```

### Problem: "Cannot find module '@testing-library/react'"

**Riešenie:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Problem: "Transform failed with SWC"

**Riešenie:**
```bash
npm install --save-dev @swc/jest
```

### Problem: "ReferenceError: document is not defined"

**Riešenie:**
```bash
npm install --save-dev jest-environment-jsdom
```

Uistite sa, že `jest.config.js` obsahuje:
```javascript
testEnvironment: 'jest-environment-jsdom'
```

### Problem: Tests pass but coverage is low

**Riešenie:**
Skontrolujte `collectCoverageFrom` pattern v `jest.config.js`:
```javascript
collectCoverageFrom: [
  'components/**/*.{js,jsx,ts,tsx}',
  // ... other patterns
]
```

## NPM Scripts

Uistite sa, že `package.json` obsahuje:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Coverage Thresholds

Aktuálne nastavené thresholds v `jest.config.js`:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

## Next Steps

Po úspešnom nastavení:

1. ✅ Spustite testy: `npm test DealTimeline`
2. ✅ Skontrolujte coverage: `npm test:coverage`
3. ✅ Pridajte testy do CI/CD pipeline
4. ✅ Vytvorte testy pre ďalšie komponenty

## CI/CD Integration

Pre GitHub Actions pridajte do `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Kontakt

Pri problémoch s nastavením kontaktujte vývojový tím.
