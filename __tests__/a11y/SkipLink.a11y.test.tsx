import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SkipLink } from '@/components/a11y/SkipLink';

describe('SkipLink Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<SkipLink />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render a link to #main-content', () => {
    const { getByText } = render(<SkipLink />);
    const link = getByText('Přejít na hlavní obsah');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should be visually hidden by default', () => {
    const { getByText } = render(<SkipLink />);
    const link = getByText('Přejít na hlavní obsah');
    expect(link.className).toContain('sr-only');
  });
});
