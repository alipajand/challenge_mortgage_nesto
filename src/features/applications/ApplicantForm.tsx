import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getErrorMessage } from '@/api/client';
import type { Applicant } from '@/api/types';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { CheckCircleIcon } from '@/components/icons';
import { TextField } from '@/components/TextField';
import { formatTime } from '@/lib/format';
import {
  applicantSchema,
  EMPTY_APPLICANT,
  isApplicantComplete,
  toApplicant,
  type ApplicantFormValues,
} from './applicant';

type ApplicantFormProps = {
  defaultValues?: Partial<Applicant>;
  onSubmit: (applicant: Applicant) => Promise<unknown>;
  submitLabel: string;
};

export function ApplicantForm({ defaultValues, onSubmit, submitLabel }: ApplicantFormProps) {
  const [savedAt, setSavedAt] = useState<Date>();
  const [saveError, setSaveError] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ApplicantFormValues>({
    resolver: zodResolver(applicantSchema),
    mode: 'onTouched',
    defaultValues: { ...EMPTY_APPLICANT, ...defaultValues },
  });

  const submit = handleSubmit(async (values) => {
    const applicant = toApplicant(values);
    setSaveError(undefined);

    try {
      await onSubmit(applicant);
      reset(applicant);
      setSavedAt(new Date());
    } catch (error) {
      setSaveError(getErrorMessage(error));
    }
  });

  const hasBeenSaved = savedAt !== undefined || isApplicantComplete(defaultValues);

  return (
    <form noValidate onSubmit={submit} className="applicant-form">
      <p className="applicant-form-notice">All fields are required.</p>

      <div className="applicant-form-names">
        <TextField
          label="First name"
          autoComplete="given-name"
          aria-required="true"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <TextField
          label="Last name"
          autoComplete="family-name"
          aria-required="true"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <TextField
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        spellCheck={false}
        aria-required="true"
        error={errors.email?.message}
        {...register('email')}
      />

      <TextField
        label="Phone number"
        hint="10-digit number, for example 514-555-0123"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        aria-required="true"
        error={errors.phone?.message}
        {...register('phone')}
      />

      {saveError && (
        <Alert tone="error" title="Your changes weren't saved">
          {saveError}
        </Alert>
      )}

      <div className="applicant-form-footer">
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingText="Saving…"
          className="applicant-form-submit"
        >
          {submitLabel}
        </Button>

        {!isSubmitting && isDirty && hasBeenSaved && (
          <p className="save-status save-status-unsaved">Unsaved changes</p>
        )}
        {!isSubmitting && !isDirty && savedAt && !saveError && (
          <p className="save-status save-status-saved">
            <CheckCircleIcon />
            Saved at {formatTime(savedAt)}
          </p>
        )}
      </div>
    </form>
  );
}
