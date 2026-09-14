import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { buildApplication, products } from '@/test/fixtures';
import { renderWithProviders } from '@/test/render';
import { ApplicationsTable } from './ApplicationsTable';

const productsById = new Map(products.map((product) => [product.id, product]));

describe('ApplicationsTable', () => {
  it('lists each application with its applicant, product and a link to edit it', () => {
    const application = buildApplication({ id: 'app-1', productId: 12347 });

    renderWithProviders(
      <ApplicationsTable applications={[application]} productsById={productsById} />,
    );

    const row = screen.getByRole('row', { name: /Jane Roy/ });
    expect(within(row).getByRole('rowheader')).toHaveTextContent('Jane Roy');
    expect(within(row).getByText('jane.roy@example.com')).toBeInTheDocument();
    expect(within(row).getByText('514-555-0101')).toBeInTheDocument();
    expect(within(row).getByText('MCAP Value-Flex Fixed Special')).toBeInTheDocument();
    expect(within(row).getByText('2.04%')).toBeInTheDocument();
    expect(within(row).getByText('Sep 14, 2026')).toBeInTheDocument();
    expect(within(row).getByRole('link', { name: 'Edit: Jane Roy' })).toHaveAttribute(
      'href',
      '/applications/app-1',
    );
  });

  it('copes with applications whose product is unknown', () => {
    renderWithProviders(
      <ApplicationsTable
        applications={[
          buildApplication({ productId: 99999 }),
          buildApplication({ id: 'x', productId: null }),
        ]}
        productsById={productsById}
      />,
    );

    expect(screen.getAllByText('Unknown product')).toHaveLength(2);
  });
});
