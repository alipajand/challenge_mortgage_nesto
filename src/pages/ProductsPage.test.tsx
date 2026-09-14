import { screen, within } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { buildProduct } from '@/test/fixtures';
import { renderApp } from '@/test/render';
import { apiUrl, mockDb, server } from '@/test/server';

describe('ProductsPage', () => {
  it('lists the best fixed and variable products', async () => {
    renderApp('/');

    expect(await screen.findByRole('status')).toHaveTextContent("Loading today's best rates…");

    const fixed = await screen.findByRole('region', { name: 'Best fixed rate' });
    const variable = screen.getByRole('region', { name: 'Best variable rate' });

    expect(within(fixed).getAllByRole('article')).toHaveLength(1);
    expect(
      within(fixed).getByRole('article', { name: 'MCAP Value-Flex Fixed Special' }),
    ).toHaveTextContent('2.04%');
    expect(
      within(variable).getByRole('article', { name: 'MCAP Value-Flex Variable Special' }),
    ).toHaveTextContent('1.25%');
    expect(document.title).toBe('Best mortgage rates · nesto');
  });

  it('shows every product tied for the best rate', async () => {
    mockDb.products = [
      buildProduct({ id: 1, type: 'FIXED', name: 'Fixed A', bestRate: 1.99 }),
      buildProduct({ id: 2, type: 'FIXED', name: 'Fixed B', bestRate: 1.99 }),
      buildProduct({ id: 3, type: 'FIXED', name: 'Fixed C', bestRate: 2.5 }),
    ];
    renderApp('/');

    const fixed = await screen.findByRole('region', { name: 'Best fixed rate' });
    expect(within(fixed).getAllByRole('article')).toHaveLength(2);
    expect(within(fixed).queryByText('Fixed C')).not.toBeInTheDocument();

    const variable = screen.getByRole('region', { name: 'Best variable rate' });
    expect(
      within(variable).getByText('No variable-rate products are available right now.'),
    ).toBeInTheDocument();
  });

  it('prevents creating several applications while one is on its way', async () => {
    server.use(
      http.post(apiUrl('/applications'), async () => {
        await delay('infinite');
        return HttpResponse.json({});
      }),
    );
    const { user } = renderApp('/');

    const fixed = await screen.findByRole('region', { name: 'Best fixed rate' });
    await user.click(within(fixed).getByRole('button', { name: /Select this product/ }));

    expect(
      await within(fixed).findByRole('button', { name: /Starting your application/ }),
    ).toHaveAttribute('aria-disabled', 'true');
    const variable = screen.getByRole('region', { name: 'Best variable rate' });
    expect(within(variable).getByRole('button', { name: /Select this product/ })).toBeDisabled();
  });

  it('explains when an application could not be started', async () => {
    server.use(
      http.post(apiUrl('/applications'), () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    );
    const { user, router } = renderApp('/');

    const variable = await screen.findByRole('region', { name: 'Best variable rate' });
    await user.click(within(variable).getByRole('button', { name: /Select this product/ }));

    expect(await screen.findByText("We couldn't start your application")).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/');
    expect(within(variable).getByRole('button', { name: /Select this product/ })).toBeEnabled();
  });

  it('offers to retry when rates cannot be loaded', async () => {
    server.use(http.get(apiUrl('/products'), () => HttpResponse.error(), { once: true }));
    const { user } = renderApp('/');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("We couldn't load today's rates");
    expect(alert).toHaveTextContent("We couldn't reach our servers.");

    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('region', { name: 'Best fixed rate' })).toBeInTheDocument();
  });
});
