import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/client';
import type { Applicant } from '@/api/types';
import { applicant } from '@/test/fixtures';
import { renderWithProviders } from '@/test/render';
import { ApplicantForm } from './ApplicantForm';

type SubmitHandler = (applicant: Applicant) => Promise<unknown>;

function renderForm(props: Partial<Parameters<typeof ApplicantForm>[0]> = {}) {
  const onSubmit = vi.fn<SubmitHandler>().mockResolvedValue(undefined);
  const utils = renderWithProviders(
    <ApplicantForm onSubmit={onSubmit} submitLabel="Save applicant info" {...props} />,
  );
  return { ...utils, onSubmit };
}

function createPendingSave() {
  const pending: { reject?: (reason: Error) => void } = {};
  const onSubmit = vi.fn<SubmitHandler>(
    () =>
      new Promise((_, reject) => {
        pending.reject = reject;
      }),
  );
  return { onSubmit, fail: (reason: Error) => pending.reject?.(reason) };
}

describe('ApplicantForm', () => {
  it('shows what is missing and focuses the first invalid field', async () => {
    const { user, onSubmit } = renderForm();

    await user.click(screen.getByRole('button', { name: 'Save applicant info' }));

    expect(await screen.findByText('Enter a first name')).toBeInTheDocument();
    expect(screen.getByText('Enter a last name')).toBeInTheDocument();
    expect(screen.getByText('Enter an email address')).toBeInTheDocument();
    expect(screen.getByText('Enter a phone number')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toHaveFocus();
    expect(screen.getByLabelText('First name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('First name')).toHaveAccessibleDescription('Enter a first name');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('validates a field when the user leaves it', async () => {
    const { user } = renderForm();

    await user.type(screen.getByLabelText('Email'), 'jane@');
    await user.tab();

    expect(
      await screen.findByText(
        'Enter an email address in the correct format, like name@example.com',
      ),
    ).toBeInTheDocument();
  });

  it('submits trimmed values with a normalized phone number', async () => {
    const { user, onSubmit } = renderForm();

    await user.type(screen.getByLabelText('First name'), ' Jane ');
    await user.type(screen.getByLabelText('Last name'), 'Roy');
    await user.type(screen.getByLabelText('Email'), 'jane.roy@example.com ');
    await user.type(screen.getByLabelText('Phone number'), '514 555 0101');
    await user.click(screen.getByRole('button', { name: 'Save applicant info' }));

    expect(onSubmit).toHaveBeenCalledWith(applicant);
    expect(await screen.findByText(/^Saved at/)).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toHaveValue('514-555-0101');
  });

  it('can be submitted with the Enter key', async () => {
    const { user, onSubmit } = renderForm({ defaultValues: applicant });

    await user.type(screen.getByLabelText('Phone number'), '{Enter}');

    expect(onSubmit).toHaveBeenCalledWith(applicant);
  });

  it('tracks unsaved changes on an existing applicant', async () => {
    const { user } = renderForm({ defaultValues: applicant });

    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Last name'), '-Tremblay');

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });

  it('shows saving progress and keeps the values when saving fails', async () => {
    const save = createPendingSave();
    const { user } = renderForm({ defaultValues: applicant, onSubmit: save.onSubmit });

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.click(screen.getByRole('button', { name: 'Save applicant info' }));

    expect(await screen.findByRole('button', { name: /Saving/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );

    save.fail(new ApiError('network'));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent("Your changes weren't saved");
    expect(alert).toHaveTextContent("We couldn't reach our servers.");
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
  });
});
