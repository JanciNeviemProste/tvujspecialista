# Testing Setup Complete

Testing environment pre Next.js 16 s Jest a React Testing Library bol úspešne nakonfigurovaný.

## Vytvorené súbory

### Konfigurácia
- ✅ `jest.config.js` - Hlavná konfigurácia Jestu
- ✅ `jest.setup.js` - Setup súbor s mockmi a globálnou konfiguráciou
- ✅ `__tests__/setup/test-utils.tsx` - Custom render funkcie a test utilities
- ✅ `__tests__/components/Button.test.tsx` - Príklad testu na overenie setupu

### Aktualizované súbory
- ✅ `package.json` - Pridané test scripty
- ✅ `.gitignore` - Pridané test snapshoty

---

## Dependencies na inštaláciu

Spusti tento príkaz na inštaláciu všetkých potrebných testing dependencies:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest @swc/jest
```

### Zoznam balíčkov:
- `jest` - Testing framework
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers pre DOM
- `@testing-library/user-event` - Simulácia user interakcií
- `jest-environment-jsdom` - JSDOM environment pre testy
- `@types/jest` - TypeScript typy pre Jest
- `@swc/jest` - SWC transformer pre rýchlejšie testy (alternatíva k babel-jest)

**Poznámka:** Používame `@swc/jest` namiesto `babel-jest` pre lepší výkon s Next.js 16.

---

## Konfiguračné súbory

### 1. jest.config.js
- Nakonfigurovaný pre Next.js 16 s App Router
- Module name mapper pre `@/` aliasy
- Coverage collection z `components/`, `lib/`, `app/`
- Coverage thresholds: 70% pre všetky metriky
- SWC transformer pre TypeScript a JSX

### 2. jest.setup.js
- Import `@testing-library/jest-dom` pre custom matchers
- Mock `next/navigation` (useRouter, useSearchParams, usePathname, useParams)
- Mock `next/dynamic`
- Mock `window.matchMedia` (pre responsive a dark mode testy)
- Mock `IntersectionObserver` a `ResizeObserver`
- Suppression niektorých React warnings v testoch

### 3. __tests__/setup/test-utils.tsx
- `renderWithProviders()` - Custom render funkcia s providers
- `MockAuthProvider` - Mock AuthContext provider
- `QueryClient` setup pre React Query testy
- Mock factory funkcie: `createMockUser()`, `createMockProfi()`
- Re-export všetkého z `@testing-library/react`

---

## Spustenie testov

Po inštalácii dependencies môžeš spustiť testy pomocou:

```bash
# Spustiť všetky testy
npm test

# Spustiť testy vo watch mode
npm run test:watch

# Spustiť testy s coverage reportom
npm run test:coverage
```

---

## Príklad testu na overenie setupu

Vytvorený bol súbor `__tests__/components/Button.test.tsx` s jednoduchým testom.

Spusti ho na overenie, že všetko funguje správne:

```bash
npm test __tests__/components/Button.test.tsx
```

**Očakávaný výsledok:**
```
PASS  __tests__/components/Button.test.tsx
  Button Component (Setup Test)
    ✓ should render button with text
    ✓ should call onClick when clicked

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
```

---

## Štruktúra testov

Odporúčaná organizácia testov:

```
__tests__/
├── setup/
│   └── test-utils.tsx          # Test utilities a providers
├── components/
│   ├── Button.test.tsx          # Príklad testu
│   ├── DealFilters.test.tsx     # Phase 3 komponenty
│   ├── DealTimeline.test.tsx
│   └── DealAnalytics.test.tsx
├── lib/
│   └── utils.test.ts            # Utility funkcie
└── integration/
    └── deals-flow.test.tsx      # Integračné testy
```

---

## Testovanie Phase 3 komponentov

### DealFilters.test.tsx
```typescript
import { renderWithProviders, screen, userEvent } from '../setup/test-utils'
import DealFilters from '@/components/deals/DealFilters'

describe('DealFilters', () => {
  it('should filter deals by status', async () => {
    const onFilterChange = jest.fn()
    const user = userEvent.setup()

    renderWithProviders(<DealFilters onFilterChange={onFilterChange} />)

    // Test implementation...
  })
})
```

### DealTimeline.test.tsx
```typescript
import { renderWithProviders, screen } from '../setup/test-utils'
import DealTimeline from '@/components/deals/DealTimeline'

describe('DealTimeline', () => {
  it('should render timeline events in chronological order', () => {
    const events = [
      { id: '1', date: '2024-01-01', title: 'Deal created' },
      { id: '2', date: '2024-01-02', title: 'Deal updated' },
    ]

    renderWithProviders(<DealTimeline events={events} />)

    // Test implementation...
  })
})
```

### DealAnalytics.test.tsx
```typescript
import { renderWithProviders, screen } from '../setup/test-utils'
import DealAnalytics from '@/components/deals/DealAnalytics'

describe('DealAnalytics', () => {
  it('should display analytics data correctly', () => {
    const analytics = {
      totalDeals: 10,
      activeDeals: 5,
      completedDeals: 3,
    }

    renderWithProviders(<DealAnalytics data={analytics} />)

    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('Total Deals')).toBeInTheDocument()
  })
})
```

---

## Best Practices

1. **Používaj renderWithProviders()** namiesto render() - zabezpečuje všetky potrebné providers
2. **Mock external dependencies** - API calls, next/navigation, atď.
3. **Test user behavior, nie implementation details** - používaj screen queries a userEvent
4. **Píš deskriptívne test names** - "should do X when Y happens"
5. **Cleanup po každom teste** - testing library to robí automaticky
6. **Používaj data-testid len ak je to nevyhnutné** - preferuj accessible queries (getByRole, getByLabelText)

---

## Coverage Reports

Po spustení `npm run test:coverage` nájdeš reporty v:
- `coverage/lcov-report/index.html` - HTML report (otvor v prehliadači)
- `coverage/coverage-summary.json` - JSON summary
- `coverage/lcov.info` - LCOV format (pre CI/CD)

---

## Troubleshooting

### Problem: "Cannot find module '@testing-library/react'"
**Riešenie:** Spusti `npm install --save-dev` príkaz vyššie

### Problem: "ReferenceError: window is not defined"
**Riešenie:** Skontroluj, že `testEnvironment: 'jest-environment-jsdom'` je v `jest.config.js`

### Problem: "useRouter() is not working in tests"
**Riešenie:** Mock je už nakonfigurovaný v `jest.setup.js`, ale môžeš ho override v konkrétnom teste:
```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), pathname: '/custom' })
}))
```

---

## Ďalšie kroky

1. Nainštaluj dependencies: `npm install --save-dev ...`
2. Spusti test setup: `npm test __tests__/components/Button.test.tsx`
3. Vytvor testy pre Phase 3 komponenty (DealFilters, DealTimeline, DealAnalytics)
4. Spusti coverage report: `npm run test:coverage`
5. Integruj testy do CI/CD pipeline

---

**Setup dokončený!** Všetky konfiguračné súbory sú pripravené. Stačí nainštalovať dependencies a môžeš začať písať testy.
