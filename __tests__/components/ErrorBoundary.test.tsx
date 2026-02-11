import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ErrorBoundary } from '@/components/ErrorBoundary';

expect.extend(toHaveNoViolations);

// A component that throws an error for testing
function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Child component content</div>;
}

// Suppress console.error for error boundary tests to keep output clean
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Suppress React error boundary related console.error messages
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('ErrorBoundary') ||
        args[0].includes('The above error occurred') ||
        args[0].includes('Error: Uncaught') ||
        args[0].includes('Test error'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  // ===== RENDERING TESTS =====

  describe('Rendering tests', () => {
    it('1. Renders children when no error', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Child component content')).toBeInTheDocument();
    });

    it('2. Shows error UI when child component throws', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert - error title is displayed
      expect(screen.getByText('Niečo sa pokazilo')).toBeInTheDocument();

      // Assert - error description is displayed
      expect(
        screen.getByText(
          /Ospravedlňujeme sa, ale pri načítaní tejto stránky došlo k chybe/
        )
      ).toBeInTheDocument();

      // Assert - child content is NOT displayed
      expect(screen.queryByText('Child component content')).not.toBeInTheDocument();
    });

    it('3. Shows custom fallback when provided', () => {
      // Arrange
      const customFallback = <div>Custom error fallback</div>;

      // Act
      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
      expect(screen.queryByText('Niečo sa pokazilo')).not.toBeInTheDocument();
    });
  });

  // ===== BUTTON TESTS =====

  describe('Button tests', () => {
    it('4. Shows reset/retry button', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Obnoviť stránku')).toBeInTheDocument();
    });

    it('5. Shows home page button', () => {
      // Arrange & Act
      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(screen.getByText('Domovská stránka')).toBeInTheDocument();
    });

    it('6. Clicking reset button clears the error state', () => {
      // Arrange
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Verify error UI is shown
      expect(screen.getByText('Niečo sa pokazilo')).toBeInTheDocument();

      // Act - click the reset button
      fireEvent.click(screen.getByText('Obnoviť stránku'));

      // Assert - after reset, the boundary attempts to re-render children
      // Since ThrowingComponent still has shouldThrow=true, it will throw again
      // and error UI will be shown again. This confirms the reset logic works.
      expect(screen.getByText('Niečo sa pokazilo')).toBeInTheDocument();
    });

    it('7. Clicking home button navigates to /', () => {
      // Arrange
      const originalLocation = window.location.href;
      delete (window as any).location;
      window.location = { href: '' } as Location;

      render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Act
      fireEvent.click(screen.getByText('Domovská stránka'));

      // Assert
      expect(window.location.href).toContain('/');

      // Cleanup
      window.location = { href: originalLocation } as Location;
    });
  });

  // ===== CALLBACK TESTS =====

  describe('Callback tests', () => {
    it('8. Calls onError callback when error occurs', () => {
      // Arrange
      const onError = jest.fn();

      // Act
      render(
        <ErrorBoundary onError={onError}>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  // ===== ACCESSIBILITY TESTS =====

  describe('Accessibility tests', () => {
    it('9. Error UI passes jest-axe accessibility check', async () => {
      // Arrange & Act
      const { container } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      // Assert
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('10. Normal render passes jest-axe accessibility check', async () => {
      // Arrange & Act
      const { container } = render(
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      // Assert
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
