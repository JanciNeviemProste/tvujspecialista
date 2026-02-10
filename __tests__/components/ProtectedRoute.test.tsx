import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock next/navigation - must be before component import
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock the AuthContext
const mockUseAuth = jest.fn()
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'specialist' },
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should redirect when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    })

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(mockReplace).toHaveBeenCalledWith('/profi/prihlaseni')
  })

  it('should show loading spinner when isLoading is true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
    })

    const { container } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    // The loading spinner has animate-spin class
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should redirect to custom path when redirectTo is specified', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
    })

    render(
      <ProtectedRoute redirectTo="/custom-login">
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(mockReplace).toHaveBeenCalledWith('/custom-login')
  })
})
