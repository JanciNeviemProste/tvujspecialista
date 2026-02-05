# Testing Environment - Inštalačné inštrukcie

## Stav setupu

✅ Testing environment pre Next.js 16 s Jest a React Testing Library je **plne nakonfigurovaný**.

### Vytvorené konfiguračné súbory:
- ✅ `jest.config.js` - Hlavná Jest konfigurácia
- ✅ `jest.setup.js` - Setup file s mockmi
- ✅ `__tests__/setup/test-utils.tsx` - Custom render utilities
- ✅ `package.json` - Pridané test scripty
- ✅ `.gitignore` - Pridané test snapshoty

### Vytvorené príklady testov:
- ✅ `__tests__/components/Button.test.tsx` - Jednoduchý test na overenie setupu
- ✅ `__tests__/components/DealFilters.test.example.tsx` - Príklad pre DealFilters
- ✅ `__tests__/components/DealTimeline.test.example.tsx` - Príklad pre DealTimeline
- ✅ `__tests__/components/DealAnalytics.test.example.tsx` - Príklad pre DealAnalytics

---

## KROK 1: Inštalácia dependencies

Spusti tento príkaz v root directory projektu:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest @swc/jest
```

### Zoznam balíčkov:

| Balíček | Verzia | Účel |
|---------|--------|------|
| `jest` | latest | Testing framework |
| `@testing-library/react` | latest | React testing utilities |
| `@testing-library/jest-dom` | latest | Custom Jest matchers pre DOM |
| `@testing-library/user-event` | latest | Simulácia user interakcií |
| `jest-environment-jsdom` | latest | JSDOM environment pre testy |
| `@types/jest` | latest | TypeScript typy pre Jest |
| `@swc/jest` | latest | SWC transformer (rýchlejší ako babel) |

**Poznámka:** Používame `@swc/jest` namiesto `babel-jest` pre lepší výkon s Next.js 16.

---

## KROK 2: Overenie inštalácie

Po inštalácii dependencies spusti jednoduchý test:

```bash
npm test __tests__/components/Button.test.tsx
```

### Očakávaný výsledok:

```
PASS  __tests__/components/Button.test.tsx
  Button Component (Setup Test)
    ✓ should render button with text (XXms)
    ✓ should call onClick when clicked (XXms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        X.XXXs
```

Ak vidíš tento výsledok, testing environment je **správne nastavený** ✅

---

## KROK 3: Spustenie testov

### Všetky dostupné príkazy:

```bash
# Spustiť všetky testy
npm test

# Spustiť testy vo watch mode (re-run pri zmenách)
npm run test:watch

# Spustiť testy s coverage reportom
npm run test:coverage

# Spustiť konkrétny test súbor
npm test Button.test.tsx

# Spustiť testy, ktoré obsahujú určitý pattern
npm test DealTimeline
```

---

## KROK 4: Overenie coverage reportu

Spusti coverage report:

```bash
npm run test:coverage
```

Coverage report sa vygeneruje v:
- **HTML:** `coverage/lcov-report/index.html` (otvor v prehliadači)
- **JSON:** `coverage/coverage-summary.json`
- **LCOV:** `coverage/lcov.info` (pre CI/CD)

### Coverage thresholds (nastavené v jest.config.js):
- **Branches:** 70%
- **Functions:** 70%
- **Lines:** 70%
- **Statements:** 70%

---

## Konfiguračné súbory

### 1. jest.config.js

Hlavné nastavenia:
- ✅ Next.js 16 integration cez `next/jest`
- ✅ Module name mapper pre `@/` aliasy
- ✅ JSDOM test environment
- ✅ SWC transformer pre TypeScript/JSX
- ✅ Coverage collection z `components/`, `lib/`, `app/`
- ✅ Coverage thresholds: 70%

### 2. jest.setup.js

Globálny setup:
- ✅ Import `@testing-library/jest-dom`
- ✅ Mock `next/navigation` (useRouter, useSearchParams, usePathname, useParams)
- ✅ Mock `next/dynamic`
- ✅ Mock `window.matchMedia` (responsive & dark mode testy)
- ✅ Mock `IntersectionObserver`
- ✅ Mock `ResizeObserver`
- ✅ Suppression niektorých React warnings

### 3. __tests__/setup/test-utils.tsx

Custom utilities:
- ✅ `renderWithProviders()` - Render s AuthContext a QueryClient
- ✅ `MockAuthProvider` - Mock authentication context
- ✅ `createMockUser()` - Factory pre mock users
- ✅ `createMockProfi()` - Factory pre mock profis
- ✅ Re-export všetkých testing utilities

---

## Príklad použitia test-utils

```typescript
import { renderWithProviders, screen, userEvent, createMockUser } from '../setup/test-utils'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render for authenticated user', () => {
    const mockUser = createMockUser({ role: 'client' })

    renderWithProviders(
      <MyComponent />,
      {
        authValue: { user: mockUser, isLoading: false }
      }
    )

    expect(screen.getByText('Welcome')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    const user = userEvent.setup()

    renderWithProviders(<MyComponent />)

    const button = screen.getByRole('button', { name: /submit/i })
    await user.click(button)

    expect(screen.getByText('Success')).toBeInTheDocument()
  })
})
```

---

## Phase 3 komponenty - Test príklady

### DealFilters

Súbor: `__tests__/components/DealFilters.test.example.tsx`

Testované scenáre:
- ✅ Rendering všetkých filter controls
- ✅ Zobrazenie initial filter values
- ✅ User interactions (change, reset, apply)
- ✅ Multiple filters naraz
- ✅ Accessibility (labels, keyboard navigation)
- ✅ Loading a error states

**Použitie:** Premenovaj na `.test.tsx` a adapuj na skutočný komponent.

### DealTimeline

Súbor: `__tests__/components/DealTimeline.test.example.tsx`

Testované scenáre:
- ✅ Rendering všetkých timeline events
- ✅ Chronological order (newest first)
- ✅ Date formatting (Slovak locale)
- ✅ Event types s rôznymi iconami
- ✅ Metadata handling
- ✅ Loading skeleton
- ✅ Empty state
- ✅ Accessibility (ARIA labels, semantic HTML)

**Použitie:** Premenovaj na `.test.tsx` a adapuj na skutočný komponent.

### DealAnalytics

Súbor: `__tests__/components/DealAnalytics.test.example.tsx`

Testované scenáre:
- ✅ Rendering všetkých analytics metrics
- ✅ Formatted revenue values
- ✅ Category distribution chart
- ✅ Status distribution s percentami
- ✅ Monthly trend chart
- ✅ Time range selection
- ✅ Chart interactions (hover, click)
- ✅ Export functionality (CSV, PDF)
- ✅ Responsive design
- ✅ Accessibility

**Použitie:** Premenovaj na `.test.tsx` a adapuj na skutočný komponent.

---

## Best Practices

### 1. Používaj renderWithProviders()
```typescript
// ✅ CORRECT
renderWithProviders(<MyComponent />)

// ❌ INCORRECT (chýbajú providers)
render(<MyComponent />)
```

### 2. Test user behavior, nie implementation details
```typescript
// ✅ CORRECT
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()

// ❌ INCORRECT
expect(wrapper.find('.submit-button')).toHaveLength(1)
```

### 3. Používaj accessible queries
```typescript
// ✅ CORRECT (preferovaný order)
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Email')
screen.getByPlaceholderText('Enter email')
screen.getByText('Welcome')

// ❌ INCORRECT (používaj len ak je to nevyhnutné)
screen.getByTestId('submit-button')
```

### 4. Mock external dependencies
```typescript
jest.mock('@/lib/api', () => ({
  fetchDeals: jest.fn()
}))
```

### 5. Cleanup je automatický
Testing Library robí cleanup automaticky po každom teste.

---

## Troubleshooting

### Problem: "Cannot find module '@testing-library/react'"

**Riešenie:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Problem: "ReferenceError: window is not defined"

**Riešenie:**
Skontroluj, že `testEnvironment: 'jest-environment-jsdom'` je v `jest.config.js`.

### Problem: "useRouter() is not working in tests"

**Riešenie:**
Mock je už nakonfigurovaný v `jest.setup.js`. Ak potrebuješ custom behavior:

```typescript
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/custom-path'
  })
}))
```

### Problem: "SyntaxError: Cannot use import statement outside a module"

**Riešenie:**
Skontroluj, že `transform` je správne nastavený v `jest.config.js` na použitie `@swc/jest`.

### Problem: "Test timeout exceeded"

**Riešenie:**
Pridaj timeout do testu:

```typescript
it('should do something', async () => {
  // test code
}, 10000) // 10 sekúnd timeout
```

---

## Štruktúra testov

Odporúčaná organizácia:

```
__tests__/
├── setup/
│   └── test-utils.tsx          # Test utilities a providers
├── components/
│   ├── Button.test.tsx          # Jednoduchý komponent
│   ├── DealFilters.test.tsx     # Phase 3 komponenty
│   ├── DealTimeline.test.tsx
│   └── DealAnalytics.test.tsx
├── lib/
│   ├── utils.test.ts            # Utility funkcie
│   └── api.test.ts              # API utilities
└── integration/
    └── deals-flow.test.tsx      # Integračné testy
```

---

## Ďalšie kroky

1. ✅ Nainštaluj dependencies: `npm install --save-dev ...`
2. ✅ Spusti test setup: `npm test Button.test.tsx`
3. 📝 Vytvor testy pre Phase 3 komponenty:
   - Premenovaj `.example.tsx` súbory na `.test.tsx`
   - Adapuj testy na skutočné komponenty
4. 🚀 Spusti coverage report: `npm run test:coverage`
5. 🔄 Integruj testy do CI/CD pipeline

---

## CI/CD Integration

### GitHub Actions príklad:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm test -- --coverage
      - run: npm run type-check

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

---

## Záver

Testing environment je **plne pripravený**. Stačí nainštalovať dependencies a môžeš začať písať testy!

Pre otázky alebo problémy pozri `__tests__/SETUP_COMPLETE.md` alebo príklady testov v `__tests__/components/`.

**Happy testing!** 🧪
