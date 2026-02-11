import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock Stripe before importing the component
const mockConfirmCardPayment = jest.fn();
const mockGetElement = jest.fn();

jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: () => ({ confirmCardPayment: mockConfirmCardPayment }),
  useElements: () => ({ getElement: mockGetElement }),
  CardElement: ({ onChange, id, ...props }: any) => (
    <div data-testid="card-element" id={id}>
      <button
        data-testid="simulate-card-complete"
        type="button"
        onClick={() => onChange?.({ complete: true })}
      />
      <button
        data-testid="simulate-card-error"
        type="button"
        onClick={() => onChange?.({ complete: false, error: { message: 'Card declined' } })}
      />
    </div>
  ),
}));

import { PaymentForm } from '@/components/commissions/PaymentForm';

describe('PaymentForm', () => {
  let mockOnSuccess: jest.Mock;
  let mockOnError: jest.Mock;

  beforeEach(() => {
    mockOnSuccess = jest.fn();
    mockOnError = jest.fn();
    mockConfirmCardPayment.mockReset();
    mockGetElement.mockReturnValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderForm = (props?: Partial<React.ComponentProps<typeof PaymentForm>>) =>
    render(
      <PaymentForm
        clientSecret="pi_test_secret"
        amount={1000}
        commissionId="comm-1"
        onSuccess={mockOnSuccess}
        onError={mockOnError}
        {...props}
      />
    );

  describe('Rendering', () => {
    it('renders card element', () => {
      renderForm();
      expect(screen.getByTestId('card-element')).toBeInTheDocument();
    });

    it('renders label "Platobná karta"', () => {
      renderForm();
      expect(screen.getByText('Platobná karta')).toBeInTheDocument();
    });

    it('renders submit button with formatted amount', () => {
      renderForm({ amount: 1500 });
      expect(screen.getByRole('button', { name: /zaplatiť.*1[\s\u00a0]500/i })).toBeInTheDocument();
    });

    it('renders Stripe security info', () => {
      renderForm();
      expect(screen.getByText(/zabezpečené pomocou stripe/i)).toBeInTheDocument();
    });
  });

  describe('Button state', () => {
    it('submit button is disabled initially', () => {
      renderForm();
      const submitButton = screen.getByRole('button', { name: /zaplatiť/i });
      expect(submitButton).toBeDisabled();
    });

    it('submit button becomes enabled after card complete', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByTestId('simulate-card-complete'));

      const submitButton = screen.getByRole('button', { name: /zaplatiť/i });
      expect(submitButton).toBeEnabled();
    });
  });

  describe('Card errors', () => {
    it('shows error when card has error', async () => {
      const user = userEvent.setup();
      renderForm();

      await user.click(screen.getByTestId('simulate-card-error'));

      expect(screen.getByText('Card declined')).toBeInTheDocument();
    });
  });

  describe('Payment flow', () => {
    it('calls onSuccess on successful payment', async () => {
      const user = userEvent.setup();
      mockConfirmCardPayment.mockResolvedValue({
        paymentIntent: { status: 'succeeded' },
      });

      renderForm();

      // Complete card
      await user.click(screen.getByTestId('simulate-card-complete'));

      // Submit
      const submitButton = screen.getByRole('button', { name: /zaplatiť/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockConfirmCardPayment).toHaveBeenCalledWith('pi_test_secret', {
          payment_method: { card: {} },
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('calls onError on failed payment', async () => {
      const user = userEvent.setup();
      mockConfirmCardPayment.mockResolvedValue({
        error: { message: 'Insufficient funds' },
      });

      renderForm();

      await user.click(screen.getByTestId('simulate-card-complete'));

      const submitButton = screen.getByRole('button', { name: /zaplatiť/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith('Insufficient funds');
        expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
      });
    });
  });
});
