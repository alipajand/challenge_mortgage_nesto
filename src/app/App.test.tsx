import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/render';

describe('App', () => {
  it('lets a client pick a product, complete the application and edit it later', async () => {
    const { user, router } = renderApp('/');

    const fixedSection = await screen.findByRole('region', { name: 'Best fixed rate' });
    await user.click(
      within(fixedSection).getByRole('button', {
        name: 'Select this product: MCAP Value-Flex Fixed Special',
      }),
    );

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Complete your application' }),
    ).toBeInTheDocument();
    expect(router.state.location.pathname).toMatch(/^\/applications\/[\w-]+$/);
    expect(screen.getByText('Incomplete')).toBeInTheDocument();

    await user.type(screen.getByLabelText('First name'), 'Jane');
    await user.type(screen.getByLabelText('Last name'), 'Roy');
    await user.type(screen.getByLabelText('Email'), 'jane.roy@example.com');
    await user.type(screen.getByLabelText('Phone number'), '(514) 555 0101');
    await user.click(screen.getByRole('button', { name: 'Save applicant info' }));

    expect(await screen.findByText('Application saved')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Application details' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toHaveValue('514-555-0101');

    await user.click(screen.getByRole('link', { name: 'View all applications' }));
    const table = await screen.findByRole('table', { name: 'Completed applications' });
    const row = within(table).getByRole('row', { name: /Jane Roy/ });
    expect(within(row).getByText('jane.roy@example.com')).toBeInTheDocument();
    expect(within(row).getByText('MCAP Value-Flex Fixed Special')).toBeInTheDocument();

    await user.click(within(row).getByRole('link', { name: 'Edit: Jane Roy' }));
    const email = await screen.findByLabelText('Email');
    expect(email).toHaveValue('jane.roy@example.com');

    await user.clear(email);
    await user.type(email, 'jane@example.com');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Application updated')).toBeInTheDocument();
  });

  it('shows a not found page for unknown routes', async () => {
    renderApp('/does-not-exist');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to rates' })).toHaveAttribute('href', '/');
  });
});
