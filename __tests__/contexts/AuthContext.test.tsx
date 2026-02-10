import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock the auth API
const mockLogin = jest.fn()
const mockLogout = jest.fn()
const mockGetMe = jest.fn()

jest.mock('@/lib/api/auth', () => ({
  authApi: {
    login: (...args: any[]) => mockLogin(...args),
    logout: (...args: any[]) => mockLogout(...args),
    getMe: (...args: any[]) => mockGetMe(...args),
  },
}))

import { AuthProvider, useAuth } from '@/contexts/AuthContext'

// Test helper component to access auth context
function TestConsumer() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'ready'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid="user">{user ? user.name : 'none'}</div>
      <button
        data-testid="login-btn"
        onClick={() => login({ email: 'test@example.com', password: 'password123' })}
      >
        Login
      </button>
      <button data-testid="logout-btn" onClick={() => logout()}>
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  // Mock localStorage
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock = {}

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key: string) => localStorageMock[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          localStorageMock[key] = value
        }),
        removeItem: jest.fn((key: string) => {
          delete localStorageMock[key]
        }),
        clear: jest.fn(() => {
          localStorageMock = {}
        }),
      },
      writable: true,
    })
  })

  it('should provide auth context to children', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Initially loading, then becomes ready since no token in localStorage
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready')
    })

    expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
    expect(screen.getByTestId('user')).toHaveTextContent('none')
  })

  it('should login, store tokens, and set user', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'specialist' }
    mockLogin.mockResolvedValue({
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      },
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready')
    })

    // Perform login
    const user = userEvent.setup()
    await user.click(screen.getByTestId('login-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('Test User')
    })

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token')
    expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token')
    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
  })

  it('should logout, clear tokens, and clear user', async () => {
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User', role: 'specialist' }
    mockLogin.mockResolvedValue({
      data: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      },
    })
    mockLogout.mockResolvedValue({})

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    // Wait for initial loading
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('ready')
    })

    // Login first
    const user = userEvent.setup()
    await user.click(screen.getByTestId('login-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('yes')
    })

    // Then logout
    await user.click(screen.getByTestId('logout-btn'))

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('no')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('none')
    expect(localStorage.clear).toHaveBeenCalled()
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test since React will log the error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestConsumer />)
    }).toThrow('useAuth must be used within an AuthProvider')

    consoleSpy.mockRestore()
  })
})
