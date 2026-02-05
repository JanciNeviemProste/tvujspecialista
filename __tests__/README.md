# Testing Documentation

Testing environment pre Next.js 16 frontend s Jest a React Testing Library.

---

## 📚 Dokumentácia

### 🚀 Quick Start
**Pre rýchly štart čítaj:** [`QUICK_START.md`](./QUICK_START.md)

3 kroky:
1. Inštaluj dependencies
2. Overiť setup
3. Spustiť testy

---

### 📖 Kompletná dokumentácia

| Dokument | Účel | Komu je určený |
|----------|------|----------------|
| **[QUICK_START.md](./QUICK_START.md)** | Rýchly štart guide | Developers |
| **[INSTALLATION_SUMMARY.md](./INSTALLATION_SUMMARY.md)** | Zhrnutie setupu | Tech leads |
| **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** | Detailná setup dokumentácia | DevOps |
| **[FINAL_SETUP_REPORT.md](./FINAL_SETUP_REPORT.md)** | Kompletný report | Project managers |
| **[../TESTING_INSTALLATION.md](../TESTING_INSTALLATION.md)** | Inštalačný návod (root) | Everyone |

---

## 🧪 Test súbory

### Setup verification
- **[components/Button.test.tsx](./components/Button.test.tsx)** - Jednoduchý test na overenie setupu

### Phase 3 komponenty (príklady)
- **[components/DealFilters.test.example.tsx](./components/DealFilters.test.example.tsx)** - DealFilters test príklad (10+ testov)
- **[components/DealTimeline.test.example.tsx](./components/DealTimeline.test.example.tsx)** - DealTimeline test príklad (15+ testov)
- **[components/DealAnalytics.test.example.tsx](./components/DealAnalytics.test.example.tsx)** - DealAnalytics test príklad (24+ testov)

### Existujúce testy
- **[components/deals/](./components/deals/)** - Existujúce testy pre deals komponenty

---

## 🛠️ Test utilities

- **[setup/test-utils.tsx](./setup/test-utils.tsx)** - Custom render funkcie, mock providers, factory funkcie

---

## 📦 Inštalácia

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest @swc/jest
```

---

## 🚀 Spustenie testov

```bash
npm test                    # Všetky testy
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm test Button.test.tsx    # Konkrétny test
```

---

## 📊 Coverage

Coverage threshold: **70%** (branches, functions, lines, statements)

```bash
npm run test:coverage
```

Report: `coverage/lcov-report/index.html`

---

## 🔧 Konfigurácia

- **[../jest.config.js](../jest.config.js)** - Jest konfigurácia
- **[../jest.setup.js](../jest.setup.js)** - Global test setup

---

## ❓ Help

**Problem s inštaláciou?** → Čítaj [INSTALLATION_SUMMARY.md](./INSTALLATION_SUMMARY.md)

**Potrebuješ quick reference?** → Čítaj [QUICK_START.md](./QUICK_START.md)

**Troubleshooting?** → Čítaj [../TESTING_INSTALLATION.md](../TESTING_INSTALLATION.md)

**Kompletný report?** → Čítaj [FINAL_SETUP_REPORT.md](./FINAL_SETUP_REPORT.md)

---

**Status:** ✅ Setup dokončený | **Next:** Inštaluj dependencies
