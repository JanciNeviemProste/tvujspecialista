import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Input } from '@/components/ui/input';

describe('Input Accessibility', () => {
  it('should have no violations with label', async () => {
    const { container } = render(<Input label="Email" type="email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations with error state', async () => {
    const { container } = render(
      <Input label="Email" type="email" error="Neplatný email" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no violations when required', async () => {
    const { container } = render(
      <Input label="Jméno" type="text" required />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should associate label with input via htmlFor', () => {
    const { container } = render(<Input label="Email" type="email" />);
    const label = container.querySelector('label');
    const input = container.querySelector('input');
    expect(label).toHaveAttribute('for');
    expect(input).toHaveAttribute('id');
    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
  });

  it('should link error message via aria-describedby', () => {
    const { container } = render(
      <Input label="Email" type="email" error="Chyba" />,
    );
    const input = container.querySelector('input');
    const errorP = container.querySelector('[role="alert"]');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
    expect(errorP).toHaveAttribute('id', input?.getAttribute('aria-describedby'));
  });
});
