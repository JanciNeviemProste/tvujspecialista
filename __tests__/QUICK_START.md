# Testing Quick Start Guide

## 🚀 3 kroky k testovaniu

### 1️⃣ Inštaluj dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest @swc/jest
```

### 2️⃣ Overiť setup
```bash
npm test __tests__/components/Button.test.tsx
```

### 3️⃣ Spustiť testy
```bash
npm test                    # Všetky testy
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

---

## 📝 Vytvorenie testu

### Jednoduchý príklad:

```typescript
// __tests__/components/MyComponent.test.tsx
import { renderWithProviders, screen, userEvent } from '../setup/test-utils'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('should handle click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MyComponent />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

---

## 🔧 Test utilities

### renderWithProviders()
```typescript
import { renderWithProviders, createMockUser } from '../setup/test-utils'

// Základné použitie
renderWithProviders(<Component />)

// S authenticated userom
const mockUser = createMockUser({ role: 'client' })
renderWithProviders(<Component />, {
  authValue: { user: mockUser, isLoading: false }
})

// S custom QueryClient
const queryClient = new QueryClient()
renderWithProviders(<Component />, { queryClient })
```

### Screen queries (preferovaný order)
```typescript
// 1. getByRole (best)
screen.getByRole('button', { name: /submit/i })
screen.getByRole('textbox', { name: /email/i })

// 2. getByLabelText
screen.getByLabelText('Email')

// 3. getByPlaceholderText
screen.getByPlaceholderText('Enter email')

// 4. getByText
screen.getByText('Welcome')

// 5. getByTestId (last resort)
screen.getByTestId('custom-component')
```

### User events
```typescript
const user = userEvent.setup()

await user.click(button)
await user.type(input, 'Hello')
await user.clear(input)
await user.selectOptions(select, 'option1')
await user.hover(element)
```

---

## 🎯 Často používané matchers

```typescript
// Existence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Visibility
expect(element).toBeVisible()
expect(element).not.toBeVisible()

// Text content
expect(element).toHaveTextContent('Hello')
expect(element).toHaveTextContent(/hello/i)

// Attributes
expect(element).toHaveAttribute('href', '/page')
expect(element).toHaveClass('active')

// Form elements
expect(input).toHaveValue('test')
expect(checkbox).toBeChecked()
expect(button).toBeDisabled()

// Function calls
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith('arg')
```

---

## 🧪 Test patterns

### Testovanie user interakcie
```typescript
it('should submit form on button click', async () => {
  const onSubmit = jest.fn()
  const user = userEvent.setup()

  renderWithProviders(<Form onSubmit={onSubmit} />)

  await user.type(screen.getByLabelText('Name'), 'John')
  await user.click(screen.getByRole('button', { name: /submit/i }))

  expect(onSubmit).toHaveBeenCalledWith({ name: 'John' })
})
```

### Testovanie async operácií
```typescript
it('should load data', async () => {
  renderWithProviders(<Component />)

  // Čakanie na element
  const element = await screen.findByText('Data loaded')
  expect(element).toBeInTheDocument()
})
```

### Testovanie error states
```typescript
it('should show error message', () => {
  renderWithProviders(<Component error="Something went wrong" />)

  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### Testovanie loading states
```typescript
it('should show loading skeleton', () => {
  renderWithProviders(<Component isLoading={true} />)

  expect(screen.getByTestId('skeleton')).toBeInTheDocument()
})
```

---

## 🔍 Debugging testy

### screen.debug()
```typescript
it('should render', () => {
  renderWithProviders(<Component />)

  // Print celý DOM
  screen.debug()

  // Print konkrétny element
  screen.debug(screen.getByRole('button'))
})
```

### logRoles()
```typescript
import { logRoles } from '@testing-library/react'

it('should render', () => {
  const { container } = renderWithProviders(<Component />)

  // Print všetky ARIA roles
  logRoles(container)
})
```

---

## 📊 Coverage report

```bash
npm run test:coverage
```

**Output:**
- Console: Coverage summary
- HTML: `coverage/lcov-report/index.html`
- JSON: `coverage/coverage-summary.json`

**Thresholds (70%):**
- Branches
- Functions
- Lines
- Statements

---

## 🛑 Časté chyby

### ❌ Nepoužívať render() priamo
```typescript
// BAD
render(<Component />)

// GOOD
renderWithProviders(<Component />)
```

### ❌ Čakať na async bez await
```typescript
// BAD
user.click(button)

// GOOD
await user.click(button)
```

### ❌ Používať testId všade
```typescript
// BAD
screen.getByTestId('submit-button')

// GOOD
screen.getByRole('button', { name: /submit/i })
```

### ❌ Testovať implementation details
```typescript
// BAD
expect(wrapper.state().count).toBe(1)

// GOOD
expect(screen.getByText('Count: 1')).toBeInTheDocument()
```

---

## 📚 Ďalšie zdroje

- **Testing Library Docs:** https://testing-library.com/docs/react-testing-library/intro/
- **Jest Docs:** https://jestjs.io/docs/getting-started
- **Common mistakes:** https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

---

## 🎯 Checklist pre nový test

- [ ] Import `renderWithProviders` namiesto `render`
- [ ] Používať `screen.getByRole` ako prvú voľbu
- [ ] Pridať `await` pred user events
- [ ] Testovať user behavior, nie implementation
- [ ] Použiť deskriptívne test names
- [ ] Pridať describe blocks pre organizáciu
- [ ] Testovať happy path aj error cases
- [ ] Testovať accessibility (ARIA labels)

---

**Ready to test!** 🧪✅
