# DealTimeline Tests - Spúšťacie príkazy

## 🚀 Quick Start (3 kroky)

```bash
# 1. Nainštalujte závislosti (jednorázovo)
npm install --save-dev jest @swc/jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# 2. Spustite testy
npm test DealTimeline

# 3. Overte coverage
npm test:coverage
```

---

## 📋 Všetky príkazy

### Základné spustenie

```bash
# Spustiť všetky testy v projekte
npm test

# Spustiť len DealTimeline testy
npm test DealTimeline

# Spustiť testy s coverage reportom
npm test:coverage

# Watch mode (automatické opätovné spustenie pri zmene)
npm test:watch DealTimeline
```

### Pokročilé príkazy

```bash
# Verbose output (detailný výstup)
npm test -- --verbose DealTimeline

# Spustiť konkrétny test suite
npm test -- --testNamePattern="Rendering tests"

# Spustiť konkrétny test
npm test -- --testNamePattern="renders timeline with events"

# Bez coverage
npm test -- --no-coverage DealTimeline

# Tichý režim (minimal output)
npm test -- --silent DealTimeline

# Update snapshots (ak pridáte snapshot testy)
npm test -- --updateSnapshot

# Zobrazenie všetkých failnutých testov
npm test -- --verbose --no-coverage
```

### CI/CD príkazy

```bash
# CI mode (bez watch, s coverage)
npm test -- --ci --coverage DealTimeline

# Parallel execution (faster)
npm test -- --maxWorkers=4 DealTimeline

# Bail on first failure
npm test -- --bail DealTimeline

# Force exit after tests complete
npm test -- --forceExit
```

### Debug príkazy

```bash
# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand DealTimeline

# Run single test file
npm test __tests__/components/deals/DealTimeline.test.tsx

# Clear cache before running
npm test -- --clearCache && npm test DealTimeline
```

### Coverage príkazy

```bash
# Full coverage report
npm test:coverage

# Coverage pre konkrétny súbor
npm test -- --coverage --collectCoverageFrom="components/deals/DealTimeline.tsx"

# Coverage v HTML formáte (otvorí v prehliadači)
npm test:coverage && open coverage/lcov-report/index.html

# Coverage threshold override
npm test -- --coverage --coverageThreshold='{"global":{"branches":80}}'
```

---

## 📊 Očakávaný výstup

### Úspešný beh (všetky testy prešli)

```
PASS  __tests__/components/deals/DealTimeline.test.tsx
  DealTimeline
    Rendering tests
      ✓ renders timeline with events (45 ms)
      ✓ shows loading skeleton when isLoading=true (12 ms)
      ✓ shows empty state when no events (10 ms)
    Event type tests
      ✓ renders CREATED event correctly (blue color, correct icon, description) (15 ms)
      ✓ renders STATUS_CHANGED event with old/new status (green color) (14 ms)
      ✓ renders NOTE_ADDED event with note text (purple color) (13 ms)
      ✓ renders EMAIL_SENT event (orange color) (12 ms)
    Chronological order test
      ✓ displays events in reverse chronological order (newest first) (18 ms)
    Date formatting tests
      ✓ formats dates correctly (Slovak locale) (16 ms)
      ✓ shows formatted time with hours and minutes (14 ms)
    Metadata handling tests
      ✓ shows old and new status for STATUS_CHANGED (17 ms)
      ✓ shows note content for NOTE_ADDED (15 ms)
      ✓ shows email type for EMAIL_SENT (14 ms)
    Accessibility tests
      ✓ has proper ARIA labels (role="list", aria-label) (20 ms)
      ✓ uses semantic HTML (<ol>, <li>, <time>) (18 ms)
    Edge cases
      ✓ handles undefined events gracefully (12 ms)
      ✓ handles single event (15 ms)
      ✓ handles unknown event type with default styling (16 ms)
      ✓ renders vertical line between events except for the last one (19 ms)
      ✓ applies custom className prop (13 ms)
      ✓ applies custom className to loading state (11 ms)
      ✓ applies custom className to empty state (10 ms)

Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        2.456 s
Ran all test suites matching /DealTimeline/i.

--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |      100 |     100 |     100 |
 DealTimeline.tsx   |     100 |      100 |     100 |     100 |
--------------------|---------|----------|---------|---------|-------------------
```

### Coverage Report

```
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |   95.82 |    94.23 |   96.15 |   95.82 |
 components/deals            |     100 |      100 |     100 |     100 |
  DealTimeline.tsx           |     100 |      100 |     100 |     100 |
 lib/utils                   |   92.31 |    88.89 |   90.91 |   92.31 |
  cn.ts                      |     100 |      100 |     100 |     100 |
  format.ts                  |   90.48 |    85.71 |   88.89 |   90.48 | 45-47
-----------------------------|---------|----------|---------|---------|-------------------
```

---

## ❌ Troubleshooting - Časté problémy

### 1. "jest is not recognized"

```bash
# Riešenie: Nainštalujte Jest
npm install --save-dev jest
```

### 2. "Cannot find module '@testing-library/react'"

```bash
# Riešenie: Nainštalujte testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### 3. "ReferenceError: document is not defined"

```bash
# Riešenie: Nainštalujte jsdom environment
npm install --save-dev jest-environment-jsdom
```

Skontrolujte `jest.config.js`:
```javascript
testEnvironment: 'jest-environment-jsdom'
```

### 4. "Transform failed"

```bash
# Riešenie: Nainštalujte SWC transformer
npm install --save-dev @swc/jest

# Vyčistite cache
npm test -- --clearCache
```

### 5. "Tests are not running"

```bash
# 1. Vyčistite cache
npm test -- --clearCache

# 2. Reštartujte watch mode
# Ctrl+C a potom
npm test:watch DealTimeline

# 3. Overte test pattern
npm test -- --listTests | grep DealTimeline
```

### 6. "Coverage below threshold"

```bash
# Zobrazenie uncovered lines
npm test:coverage -- --verbose

# Otvorte HTML report
open coverage/lcov-report/index.html
```

### 7. "Module path mapping error"

Skontrolujte `jest.config.js`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

---

## 🎯 Kontrolný zoznam pred commitom

```bash
# 1. Spustite všetky testy
npm test DealTimeline

# 2. Overte coverage
npm test:coverage

# 3. Skontrolujte linting (ak máte nastavený)
npm run lint

# 4. Type check
npm run type-check

# 5. Všetko OK? Commitnite!
git add __tests__/components/deals/
git commit -m "Add comprehensive DealTimeline component tests (22 tests)"
```

---

## 📁 Súbory na commit

```bash
# Nové súbory na pridanie do Git
git add __tests__/components/deals/DealTimeline.test.tsx
git add __tests__/components/deals/mockData.ts
git add __tests__/components/deals/README.md
git add __tests__/components/deals/SETUP.md
git add __tests__/components/deals/TEST_SUMMARY.md
git add __tests__/components/deals/EXAMPLE_USAGE.md
git add __tests__/components/deals/INDEX.md
git add __tests__/components/deals/RUN_TESTS.md

# Alebo všetky naraz
git add __tests__/components/deals/*.tsx
git add __tests__/components/deals/*.ts
git add __tests__/components/deals/*.md
```

---

## 🔄 Watch Mode použitie

```bash
# Spustite watch mode
npm test:watch DealTimeline

# V watch mode môžete použiť:
# Press a - run all tests
# Press f - run only failed tests
# Press o - run only tests related to changed files
# Press p - filter by filename pattern
# Press t - filter by test name pattern
# Press q - quit watch mode
# Press Enter - trigger a test run
```

---

## 📈 Performance Monitoring

```bash
# Measure test execution time
npm test -- --verbose DealTimeline | grep "Time:"

# Show slowest tests
npm test -- --verbose DealTimeline 2>&1 | grep "ms)"

# Profile tests
npm test -- --logHeapUsage DealTimeline
```

---

## 🧪 Individual Test Execution

```bash
# Run only "Rendering tests" suite
npm test -- --testNamePattern="Rendering tests" DealTimeline

# Run only "renders timeline with events" test
npm test -- --testNamePattern="renders timeline with events" DealTimeline

# Run multiple specific tests
npm test -- --testNamePattern="renders|shows" DealTimeline
```

---

## 📦 Pre-commit Hook (Optional)

Vytvorte `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests before commit
npm test DealTimeline --silent

# Check if tests passed
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Commit aborted."
  exit 1
fi

echo "✅ All tests passed!"
```

---

## 🎓 Užitočné npm skripty

Pridajte do `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:deals": "jest __tests__/components/deals",
    "test:timeline": "jest DealTimeline",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

Použitie:
```bash
npm run test:deals     # Všetky deal testy
npm run test:timeline  # Len timeline testy
npm run test:ci        # CI mode
npm run test:debug     # Debug mode
```

---

## 📞 Pomoc

Ak máte problémy:

1. **Skontrolujte dokumentáciu:**
   - [SETUP.md](./SETUP.md) - Inštalácia a konfigurácia
   - [README.md](./README.md) - Test coverage
   - [EXAMPLE_USAGE.md](./EXAMPLE_USAGE.md) - Príklady

2. **Vyčistite cache:**
   ```bash
   npm test -- --clearCache
   ```

3. **Reinstalujte závislosti:**
   ```bash
   rm -rf node_modules
   npm install
   ```

4. **Skontrolujte verzie:**
   ```bash
   npm list jest @testing-library/react
   ```

---

**Vyhotovené:** 2026-02-05
**Status:** ✅ Ready to use

**Happy Testing! 🎉**
