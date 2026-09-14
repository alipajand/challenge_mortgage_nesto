import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('links to the live site', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'nesto.alipajand.com' })).toHaveAttribute(
      'href',
      'https://nesto.alipajand.com',
    );
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Ali Pajand');
  });
});
