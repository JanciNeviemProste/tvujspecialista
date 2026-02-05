import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock User Type
export interface MockUser {
  id: string
  email: string
  role: 'client' | 'profi' | 'admin'
  firstName: string
  lastName: string
}

// Mock Auth Context Value
interface MockAuthContextValue {
  user: MockUser | null
  isLoading: boolean
  login: jest.Mock
  logout: jest.Mock
  register: jest.Mock
}

// Create a mock AuthContext
const AuthContext = React.createContext<MockAuthContextValue | undefined>(undefined)

// Mock Auth Provider
interface MockAuthProviderProps {
  children: React.ReactNode
  value?: Partial<MockAuthContextValue>
}

export const MockAuthProvider: React.FC<MockAuthProviderProps> = ({
  children,
  value = {}
}) => {
  const defaultValue: MockAuthContextValue = {
    user: null,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    ...value,
  }

  return (
    <AuthContext.Provider value={defaultValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Create a test QueryClient with defaults optimized for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {}, // Suppress errors in tests
    },
  })

// All Providers Wrapper
interface AllProvidersProps {
  children: React.ReactNode
  queryClient?: QueryClient
  authValue?: Partial<MockAuthContextValue>
}

export const AllProviders: React.FC<AllProvidersProps> = ({
  children,
  queryClient,
  authValue = {},
}) => {
  const testQueryClient = queryClient || createTestQueryClient()

  return (
    <QueryClientProvider client={testQueryClient}>
      <MockAuthProvider value={authValue}>
        {children}
      </MockAuthProvider>
    </QueryClientProvider>
  )
}

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
  authValue?: Partial<MockAuthContextValue>
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { queryClient, authValue, ...renderOptions } = options || {}

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllProviders queryClient={queryClient} authValue={authValue}>
      {children}
    </AllProviders>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient: queryClient || createTestQueryClient(),
  }
}

// Mock factory functions for common test data
export const createMockUser = (overrides?: Partial<MockUser>): MockUser => ({
  id: '1',
  email: 'test@example.com',
  role: 'client',
  firstName: 'John',
  lastName: 'Doe',
  ...overrides,
})

export const createMockProfi = (overrides?: Partial<MockUser>): MockUser => ({
  id: '2',
  email: 'profi@example.com',
  role: 'profi',
  firstName: 'Jane',
  lastName: 'Smith',
  ...overrides,
})

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
