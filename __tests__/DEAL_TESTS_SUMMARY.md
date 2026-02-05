# Deal Tests Summary

Kompletná dokumentácia pre nové testovacie súbory deals komponentov a utility funkcií.

---

## Vytvorené testovacie súbory

### 1. `__tests__/components/deals/DealAnalytics.test.tsx` (15 testov)

**Účel:** Testuje komponent `components/deals/DealAnalytics.tsx`

**Testovaný komponent:**
```typescript
interface DealAnalyticsProps {
  analytics: DealAnalyticsData | null;
  isLoading?: boolean;
  className?: string;
}
```

**Test coverage:**

#### Rendering tests (3 testy)
1. ✅ Renders analytics dashboard with all metrics
2. ✅ Shows loading skeleton when isLoading=true
3. ✅ Handles null analytics gracefully

#### Metric display tests (4 testy)
4. ✅ Displays conversion rate as percentage
5. ✅ Displays average deal value formatted as EUR
6. ✅ Displays average time to close in days
7. ✅ Displays win rate as percentage

#### Status distribution tests (3 testy)
8. ✅ Renders status distribution bars
9. ✅ Shows correct counts for each status
10. ✅ Calculates bar widths correctly (relative to total)

#### Monthly trend tests (2 testy)
11. ✅ Renders monthly trend chart (last 6 months)
12. ✅ Shows won vs lost deals per month

#### Accessibility tests (3 testy)
13. ✅ Has proper ARIA labels (role="region")
14. ✅ Uses role="progressbar" for bars with aria-valuenow
15. ✅ Has semantic heading structure

---

### 2. `__tests__/lib/utils/exportDeals.test.ts` (15 testov)

**Účel:** Testuje funkciu `lib/utils/exportDeals.ts`

**Testovaná funkcia:**
```typescript
export function exportDealsToCSV(deals: Deal[], filename?: string): void
```

**Test coverage:**

#### Basic functionality (3 testy)
1. ✅ Exports array of deals to CSV
2. ✅ Uses provided filename or generates default (deals-YYYY-MM-DD.csv)
3. ✅ Triggers browser download

#### CSV format tests (4 testy)
4. ✅ Includes correct headers (Slovak names)
5. ✅ Includes all deal fields (customerName, email, phone, status, value, dates, notes count)
6. ✅ Formats dates in Slovak locale (dd.MM.yyyy)
7. ✅ Formats currency values as EUR

#### UTF-8 encoding tests (2 testy)
8. ✅ Handles Slovak special characters (á, č, ď, é, í, ľ, ň, ó, š, ť, ú, ý, ž)
9. ✅ Includes UTF-8 BOM for Excel compatibility

#### Empty values handling (2 testy)
10. ✅ Handles null/undefined dealValue
11. ✅ Handles missing estimatedCloseDate

#### Edge cases (3 testy)
12. ✅ Handles empty deals array (exports only headers)
13. ✅ Handles single deal
14. ✅ Handles deals with special characters in text fields (quotes, commas, newlines)

#### Browser API mock (1 test)
15. ✅ Mocks document.createElement, URL.createObjectURL, link.click()

---

## Spustenie testov

```bash
# Spustenie všetkých testov
npm test

# Spustenie len DealAnalytics testov
npm test -- __tests__/components/deals/DealAnalytics.test.tsx

# Spustenie len exportDeals testov
npm test -- __tests__/lib/utils/exportDeals.test.ts

# Spustenie oboch súborov
npm test -- __tests__/components/deals/DealAnalytics.test.tsx __tests__/lib/utils/exportDeals.test.ts

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## Test výsledky

```
Test Suites: 2 passed, 2 total
Tests:       30 passed, 30 total
Snapshots:   0 total
Time:        ~5s
```

---

## Technické detaily

### Použité knižnice
- **Jest** - Test runner a assertion knižnica
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom matchers pre DOM testy

### Test pattern
Všetky testy používajú **Arrange-Act-Assert (AAA)** pattern:

```typescript
it('Test description', () => {
  // Arrange - pripravíme dáta a mockujeme závislosti
  const mockData = { ... };

  // Act - vykonáme testovanú akciu
  const result = functionUnderTest(mockData);

  // Assert - overíme očakávaný výsledok
  expect(result).toBe(expectedValue);
});
```

### Mockované API

#### Browser APIs (exportDeals.test.ts)
- `document.createElement` - Vytváranie link elementu
- `document.body.appendChild` - Pridávanie elementu do DOM
- `document.body.removeChild` - Odstránenie elementu z DOM
- `URL.createObjectURL` - Vytváranie blob URL
- `URL.revokeObjectURL` - Uvoľnenie blob URL
- `window.alert` - Alert dialóg
- `global.Blob` - Vytváranie blob objektov

#### React Testing Library (DealAnalytics.test.tsx)
- `render` - Renderovanie React komponentov
- `screen` - Query na vyhľadávanie elementov
- `container` - Direct access na DOM container

---

## Súborová štruktúra

```
__tests__/
├── components/
│   └── deals/
│       └── DealAnalytics.test.tsx    (15 testov)
├── lib/
│   └── utils/
│       └── exportDeals.test.ts       (15 testov)
├── README.md                          (Hlavná dokumentácia)
└── DEAL_TESTS_SUMMARY.md             (Tento súbor)
```

---

## Kľúčové features testov

### DealAnalytics.test.tsx
✅ Kompletné testovanie všetkých metrík
✅ Loading states
✅ Empty states
✅ Accessibility (ARIA labels, semantic HTML)
✅ Percentuálne výpočty
✅ Currency formatting (EUR)
✅ Status distribution visualization
✅ Monthly trend visualization

### exportDeals.test.ts
✅ CSV export funkcionalita
✅ Slovenské názvy stĺpcov
✅ UTF-8 encoding s BOM
✅ Slovak locale formátovanie dátumov
✅ Currency formatting
✅ Špeciálne znaky (quotes, commas, newlines)
✅ Edge cases (prázdne pole, null hodnoty)
✅ Browser download triggering

---

## Best Practices

1. **Arrange-Act-Assert pattern** - Štruktúrované testovanie
2. **Descriptive test names** - Jasné a výstižné názvy testov
3. **Mock external dependencies** - Mockované všetky externé závislosti
4. **Test user behavior** - Testovanie správania používateľa, nie implementácie
5. **Accessibility first** - Testovanie prístupnosti (ARIA labels, semantic HTML)
6. **Edge cases** - Testovanie hraničných prípadov a error stavov
7. **Type safety** - Plná TypeScript typová kontrola
8. **Isolation** - Každý test je izolovaný (beforeEach setup)

---

## Ďalšie kroky

Pre rozšírenie test coverage môžete pridať:

1. **Integration testy** - Testovanie interakcie medzi komponentmi
2. **E2E testy** - End-to-end testovanie celého flow
3. **Visual regression testy** - Testovanie vizuálnych zmien
4. **Performance testy** - Testovanie výkonu komponentov
5. **API mocking** - Mockované API volania pre deals endpoints

---

## Troubleshooting

### Problém: Testy zlyhávajú pri spustení
**Riešenie:** Overte, že sú nainštalované všetky dependencies:
```bash
npm install
```

### Problém: Mock errors
**Riešenie:** Skontrolujte, či je správne nakonfigurovaný `jest.setup.cjs`:
```bash
cat jest.setup.cjs
```

### Problém: TypeScript errors
**Riešenie:** Skontrolujte TypeScript konfiguráciu:
```bash
npm run type-check
```

---

**Status:** ✅ Všetky testy prechádzajú (30/30)
**Coverage:** Vysoké pokrytie kódu pre oba súbory
**Maintenance:** Ľahko rozšíriteľné a udržiavateľné
