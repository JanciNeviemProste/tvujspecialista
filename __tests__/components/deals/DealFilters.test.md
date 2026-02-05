# DealFilters Component - Test Documentation

## Overview
Komplexné unit testy pre DealFilters komponent s 23 test cases pokrývajúcimi všetku funkcionalitu komponentu.

## Test Statistics
- **Total Tests**: 23
- **Status**: ✅ All Passing
- **Test Categories**: 8
- **Coverage Areas**: Rendering, User Interactions, State Management, Accessibility

## Test Structure

### 1. Rendering Tests (3 tests)
Overujú správne vykreslenie základných UI elementov:

- ✅ **renders search input** - Overí prítomnosť search inputu s správnymi atribútmi
- ✅ **renders status dropdown** - Overí prítomnosť status selectu
- ✅ **renders advanced filters toggle button** - Overí toggle button pre pokročilé filtre

### 2. Search Filter Tests (3 tests)
Testujú funkčnosť vyhľadávania:

- ✅ **updates search filter on input** - Overí, že zadanie textu volá callback
- ✅ **calls onFiltersChange with search value** - Overí správne volanie s hodnotou
- ✅ **displays entered search value** - Overí zobrazenie zadanej hodnoty

### 3. Status Filter Tests (2 tests)
Testujú dropdown pre výber statusu:

- ✅ **updates status filter on select change** - Overí zmenu statusu
- ✅ **shows all status options** - Overí prítomnosť všetkých 7 opcií (all + 6 statusov)

### 4. Value Range Slider Tests (3 tests)
Testujú slider pre rozsah hodnoty dealu:

- ✅ **renders value range slider with correct min/max** - Overí správne zobrazenie rozsahu
- ✅ **updates valueRange on slider change** - Overí aktualizáciu hodnôt
- ✅ **displays current range values** - Overí formátované zobrazenie hodnôt (€)

### 5. Date Range Picker Tests (4 tests)
Testujú výber dátumového rozsahu:

- ✅ **renders date range picker** - Overí prítomnosť Od/Do date inputov
- ✅ **updates dateRange.from on change** - Overí zmenu dátumu "Od"
- ✅ **updates dateRange.to on change** - Overí zmenu dátumu "Do"
- ✅ **switches dateType between 'created' and 'estimatedClose'** - Overí prepínanie typu dátumu

### 6. Clear Filters Tests (3 tests)
Testujú resetovanie filtrov:

- ✅ **shows clear filters button when filters active** - Overí zobrazenie tlačidla pri aktívnych filtroch
- ✅ **resets all filters to default on click** - Overí reset na defaultné hodnoty
- ✅ **does not show clear filters button when no filters active** - Overí skrytie tlačidla

### 7. Advanced Filters Toggle (1 test)
Testuje rozbaľovanie pokročilých filtrov:

- ✅ **toggles advanced filters section visibility** - Overí show/hide funkcionalitu s ARIA atribútmi

### 8. Edge Cases and Integration (4 tests)
Testujú okrajové prípady a integračné scenáre:

- ✅ **handles empty deals array gracefully** - Overí správne chovanie bez dát
- ✅ **calculates max deal value correctly from deals** - Overí výpočet max hodnoty zo zoznamu
- ✅ **maintains filter state between toggling advanced filters** - Overí zachovanie stavu
- ✅ **has proper ARIA labels for accessibility** - Overí accessibility atribúty

## Test Data Factories

### Mock Deal Factory
```typescript
const createMockDeal = (overrides?: Partial<Deal>): Deal
```
Vytvára mock deal objekty s realistickými dátami.

### Mock Deals Array
```typescript
const createMockDeals = (): Deal[]
```
Vytvára pole 5 mock dealov s rôznymi statusmi a hodnotami.

### Default Filters
```typescript
const createDefaultFilters = (): DealFiltersType
```
Vytvára defaultné filtre pre testy.

## Testing Utilities Used

- **@testing-library/react** - Rendering a queries
- **@testing-library/user-event** - Simulácia user interakcií
- **renderWithProviders** - Custom render wrapper s QueryClient a Auth context
- **jest** - Test runner a assertions

## Key Testing Patterns

### Arrange-Act-Assert Pattern
Všetky testy používajú AAA pattern pre lepšiu čitateľnosť:
```typescript
// Arrange
const user = userEvent.setup();
renderWithProviders(<Component />);

// Act
await user.click(button);

// Assert
expect(mockCallback).toHaveBeenCalled();
```

### Accessibility Testing
Testy používajú semantic queries (getByRole, getByLabelText) pre overenie accessibility.

### Async Testing
Používanie `waitFor` pre asynchrónne operácie a DOM updates.

## Mock Functions

```typescript
const mockOnFiltersChange = jest.fn();
```
Mock callback funkcia pre testovanie event handlerov.

## Running Tests

```bash
# Run all DealFilters tests
npm test -- __tests__/components/deals/DealFilters.test.tsx

# Run with coverage
npm test -- __tests__/components/deals/DealFilters.test.tsx --coverage

# Run in watch mode
npm test -- __tests__/components/deals/DealFilters.test.tsx --watch
```

## Coverage

Testy pokrývajú:
- ✅ Všetky user flows
- ✅ Edge cases (prázdne pole, veľké hodnoty)
- ✅ State management
- ✅ Event handling
- ✅ Conditional rendering
- ✅ Accessibility features
- ✅ Integration scenarios

## Notes

1. **Radix UI Slider** - Slider komponent nepoužíva štandardný `role="slider"`, preto testy overujú zobrazené hodnoty namiesto priamej interakcie so sliderom.

2. **User Events** - Používame `@testing-library/user-event` namiesto `fireEvent` pre realistickejšiu simuláciu user interakcií.

3. **Controlled Components** - Komponenty sú controlled, takže testy overujú volania `onFiltersChange` callbacku namiesto interného stavu.

4. **Debouncing** - V prípade implementácie debouncingu v budúcnosti, test "updates search filter on input" by mal byť upravený s použitím `waitFor` alebo `act`.

## Future Improvements

- Pridať testy pre debounced search (ak bude implementovaný)
- Pridať snapshot testy pre visual regression
- Pridať testy pre keyboard navigation
- Pridať performance testy pre veľké datasets
