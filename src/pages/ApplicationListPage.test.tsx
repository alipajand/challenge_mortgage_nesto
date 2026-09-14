import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { applicant, buildApplication } from '@/test/fixtures';
import { renderApp } from '@/test/render';
import { apiUrl, mockDb, server } from '@/test/server';

const emptyApplicant = { firstName: '', lastName: '', email: '', phone: '' };

describe('ApplicationListPage', () => {
  it('only lists applications with complete and valid contact information', async () => {
    mockDb.applications = [
      buildApplication({ id: 'complete', createdAt: '2026-09-01' }),
      buildApplication({
        id: 'newest',
        createdAt: '2026-09-12',
        applicants: [{ ...applicant, firstName: 'Luc', lastName: 'Gagnon' }],
      }),
      buildApplication({ id: 'empty', applicants: [emptyApplicant] }),
      buildApplication({ id: 'bad-email', applicants: [{ ...applicant, email: 'not-an-email' }] }),
      buildApplication({ id: 'no-applicants', applicants: [] }),
    ];
    renderApp('/applications');

    const table = await screen.findByRole('table', { name: 'Completed applications' });
    const rows = within(table).getAllByRole('row').slice(1);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Luc Gagnon');
    expect(rows[1]).toHaveTextContent('Jane Roy');
    expect(screen.getByText('2 applications')).toBeInTheDocument();
  });

  it('explains why the list is empty and points to the rates', async () => {
    mockDb.applications = [buildApplication({ applicants: [emptyApplicant] })];
    renderApp('/applications');

    expect(await screen.findByRole('heading', { name: 'No applications yet' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse rates' })).toHaveAttribute('href', '/');
  });

  it('still lists applications when products cannot be loaded', async () => {
    mockDb.applications = [buildApplication()];
    server.use(http.get(apiUrl('/products'), () => HttpResponse.error()));
    renderApp('/applications');

    const row = await screen.findByRole('row', { name: /Jane Roy/ });
    expect(within(row).getByText('Unknown product')).toBeInTheDocument();
  });

  it('offers to retry when applications cannot be loaded', async () => {
    mockDb.applications = [buildApplication()];
    server.use(
      http.get(apiUrl('/applications'), () => HttpResponse.json({}, { status: 503 }), {
        once: true,
      }),
    );
    const { user } = renderApp('/applications');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("We couldn't load applications");

    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('row', { name: /Jane Roy/ })).toBeInTheDocument();
  });
});
