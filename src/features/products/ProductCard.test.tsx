import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Product } from '@/api/types';
import { buildProduct } from '@/test/fixtures';
import { renderWithProviders } from '@/test/render';
import { ProductCard } from './ProductCard';

const product = buildProduct({
  id: 12347,
  name: 'MCAP Value-Flex Fixed Special',
  type: 'FIXED',
  term: '5_YEAR',
  rateHold: '90_DAYS',
  prepaymentOption: 'STANDARD',
  restrictionsOption: 'SOME_RESTRICTIONS',
  bestRate: 2.04,
});

const onSelectMock = () => vi.fn<(product: Product) => void>();

function getDetail(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling?.textContent;
}

describe('ProductCard', () => {
  it('shows the product, its best rate and its main features', () => {
    renderWithProviders(<ProductCard product={product} />);

    const card = screen.getByRole('article', { name: 'MCAP Value-Flex Fixed Special' });
    expect(card).toHaveTextContent('5-year fixed');
    expect(card).toHaveTextContent('2.04%');
    expect(getDetail('Term')).toBe('5 years');
    expect(getDetail('Rate hold')).toBe('90 days');
    expect(getDetail('Prepayment')).toBe('Standard');
    expect(getDetail('Restrictions')).toBe('Some');
  });

  it('only offers selection when a handler is given', () => {
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onSelect with the product', async () => {
    const onSelect = onSelectMock();
    const { user } = renderWithProviders(<ProductCard product={product} onSelect={onSelect} />);

    await user.click(
      screen.getByRole('button', { name: 'Select this product: MCAP Value-Flex Fixed Special' }),
    );

    expect(onSelect).toHaveBeenCalledWith(product);
  });

  it('shows progress and ignores clicks while the application is being created', async () => {
    const onSelect = onSelectMock();
    const { user } = renderWithProviders(
      <ProductCard product={product} onSelect={onSelect} isSelecting />,
    );

    const button = screen.getByRole('button', { name: /Starting your application/ });
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await user.click(button);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('can be disabled while another product is being selected', () => {
    renderWithProviders(<ProductCard product={product} onSelect={onSelectMock()} isDisabled />);

    expect(screen.getByRole('button', { name: /Select this product/ })).toBeDisabled();
  });

  it('falls back to raw values for options it does not know', () => {
    renderWithProviders(
      <ProductCard
        product={buildProduct({
          name: 'Open',
          term: 'OPEN' as Product['term'],
          restrictionsOption: 'NEW_OPTION' as Product['restrictionsOption'],
        })}
      />,
    );

    expect(getDetail('Term')).toBe('OPEN');
    expect(getDetail('Restrictions')).toBe('NEW_OPTION');
  });
});
