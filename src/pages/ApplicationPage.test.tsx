import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { applicant, buildApplication } from '@/test/fixtures';
import { renderApp } from '@/test/render';
import { apiUrl, mockDb, server } from '@/test/server';

const coApplicant = {
  firstName: 'Marc',
  lastName: 'Roy',
  email: 'marc.roy@example.com',
  phone: '514-555-0102',
};

describe('ApplicationPage', () => {
  it('shows an existing application with its product and prefilled contact information', async () => {
    mockDb.applications = [buildApplication({ id: 'app-1' })];
    renderApp('/applications/app-1');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Application details' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Reference APP-1')).toBeInTheDocument();
    expect(screen.getByText('Created Sep 14, 2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to applications' })).toHaveAttribute(
      'href',
      '/applications',
    );

    const product = screen.getByRole('region', { name: 'Selected product' });
    expect(
      await within(product).findByRole('heading', { name: 'MCAP Value-Flex Fixed Special' }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText('First name')).toHaveValue('Jane');
    expect(screen.getByLabelText('Last name')).toHaveValue('Roy');
    expect(screen.getByLabelText('Email')).toHaveValue('jane.roy@example.com');
    expect(screen.getByLabelText('Phone number')).toHaveValue('514-555-0101');
  });

  it('updates the main applicant and keeps co-applicants', async () => {
    mockDb.applications = [buildApplication({ id: 'app-1', applicants: [applicant, coApplicant] })];
    const { user } = renderApp('/applications/app-1');

    const phone = await screen.findByLabelText('Phone number');
    await user.clear(phone);
    await user.type(phone, '438 555 0199');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(await screen.findByText('Application updated')).toBeInTheDocument();
    expect(await screen.findByText(/^Saved at/)).toBeInTheDocument();
    expect(mockDb.applications[0]?.applicants).toEqual([
      { ...applicant, phone: '438-555-0199' },
      coApplicant,
    ]);
  });

  it('tells the user when saving fails and keeps what they typed', async () => {
    mockDb.applications = [buildApplication({ id: 'app-1' })];
    server.use(
      http.put(apiUrl('/applications/:id'), () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 }),
      ),
    );
    const { user } = renderApp('/applications/app-1');

    const firstName = await screen.findByLabelText('First name');
    await user.clear(firstName);
    await user.type(firstName, 'Janet');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("Your changes weren't saved");
    expect(alert).toHaveTextContent('Something went wrong on our side.');
    expect(firstName).toHaveValue('Janet');
  });

  it('shows a dedicated message when the application does not exist', async () => {
    renderApp('/applications/00000000-0000-0000-0000-000000000000');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Application not found' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to applications' })).toBeInTheDocument();
  });

  it('offers to retry when the application cannot be loaded', async () => {
    mockDb.applications = [buildApplication({ id: 'app-1' })];
    server.use(http.get(apiUrl('/applications/:id'), () => HttpResponse.error(), { once: true }));
    const { user } = renderApp('/applications/app-1');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("We couldn't load this application");

    await user.click(within(alert).getByRole('button', { name: 'Try again' }));

    expect(await screen.findByLabelText('First name')).toHaveValue('Jane');
  });

  it('still lets the user fill in the form when the product details are unavailable', async () => {
    mockDb.applications = [buildApplication({ id: 'app-1', productId: 1 })];
    renderApp('/applications/app-1');

    const product = await screen.findByRole('region', { name: 'Selected product' });
    expect(
      await within(product).findByText("Details for this product aren't available right now."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeEnabled();
  });
});
