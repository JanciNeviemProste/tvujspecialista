import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileNav } from '@/components/layout/MobileNav';

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('MobileNav', () => {
  it('should render hamburger button', () => {
    render(<MobileNav />);
    const button = screen.getByRole('button', { name: /otvoriť menu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should open menu on click', async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    const button = screen.getByRole('button', { name: /otvoriť menu/i });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: /hlavní navigace/i })).toBeInTheDocument();
  });

  it('should close menu on Escape key', async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    const button = screen.getByRole('button', { name: /otvoriť menu/i });
    await user.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('should show navigation links when open', async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByRole('button', { name: /otvoriť menu/i }));

    expect(screen.getByText('Domov')).toBeInTheDocument();
    expect(screen.getByText(/hľadať/i)).toBeInTheDocument();
    expect(screen.getByText('Ceny')).toBeInTheDocument();
    expect(screen.getByText('Akadémia')).toBeInTheDocument();
    expect(screen.getByText('Komunita')).toBeInTheDocument();
  });

  it('should show login/register buttons when not authenticated', async () => {
    const user = userEvent.setup();
    render(<MobileNav />);
    await user.click(screen.getByRole('button', { name: /otvoriť menu/i }));

    expect(screen.getByText('Prihlásiť sa')).toBeInTheDocument();
    expect(screen.getByText('Registrácia zdarma')).toBeInTheDocument();
  });
});
