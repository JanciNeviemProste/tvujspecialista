# Tests Quick Reference

Rýchly prehľad nových testov pre deals moduly.

---

## 📋 Vytvorené súbory

| Súbor | Testy | Status |
|-------|-------|--------|
| `__tests__/components/deals/DealAnalytics.test.tsx` | 15 | ✅ Passing |
| `__tests__/lib/utils/exportDeals.test.ts` | 15 | ✅ Passing |
| **Total** | **30** | **✅ All passing** |

---

## 🚀 Príkazy

```bash
# Všetky testy
npm test

# Konkrétne testy
npm test -- DealAnalytics.test.tsx
npm test -- exportDeals.test.ts

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📊 Test breakdown

### DealAnalytics.test.tsx (15)
- 3x Rendering tests (loading, null handling)
- 4x Metric display (conversion, value, time, win rate)
- 3x Status distribution (bars, counts, widths)
- 2x Monthly trend (chart, won vs lost)
- 3x Accessibility (ARIA, semantic HTML)

### exportDeals.test.ts (15)
- 3x Basic functionality (export, filename, download)
- 4x CSV format (headers, fields, dates, currency)
- 2x UTF-8 encoding (special chars, BOM)
- 2x Empty values (null value, missing date)
- 3x Edge cases (empty array, single deal, special chars)
- 1x Browser API mocks

---

## 🔧 Test pattern

```typescript
it('Test name', () => {
  // Arrange
  const mockData = { ... };

  // Act
  render(<Component data={mockData} />);

  // Assert
  expect(screen.getByText('...')).toBeInTheDocument();
});
```

---

## 📝 Mock setup (exportDeals)

```typescript
beforeEach(() => {
  global.alert = jest.fn();
  global.URL.createObjectURL = jest.fn();
  global.URL.revokeObjectURL = jest.fn();
  document.createElement = jest.fn();
  document.body.appendChild = jest.fn();
  document.body.removeChild = jest.fn();
});
```

---

## ✅ Testované features

### DealAnalytics
- ✅ Všetky metriky (conversion, value, time, win rate)
- ✅ Loading skeleton
- ✅ Null/empty states
- ✅ Status distribution bars
- ✅ Monthly trend chart
- ✅ ARIA labels a accessibility
- ✅ EUR currency formatting
- ✅ Percentuálne výpočty

### exportDeals
- ✅ CSV export
- ✅ Slovenské hlavičky
- ✅ UTF-8 BOM
- ✅ Slovak date format (dd.MM.yyyy)
- ✅ EUR formatting
- ✅ Null/undefined handling
- ✅ Special characters (quotes, commas, newlines)
- ✅ Browser download trigger

---

## 📍 File locations

```
C:\Users\janst\OneDrive\Počítač\tvujspecialista-main\__tests__\
├── components\deals\DealAnalytics.test.tsx
└── lib\utils\exportDeals.test.ts
```

---

## 🔍 Dokumentácia

- **[DEAL_TESTS_SUMMARY.md](./DEAL_TESTS_SUMMARY.md)** - Kompletná dokumentácia
- **[README.md](./README.md)** - Hlavná test dokumentácia
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide

---

**Last updated:** 2025-02-05
**Test status:** ✅ All 30 tests passing
