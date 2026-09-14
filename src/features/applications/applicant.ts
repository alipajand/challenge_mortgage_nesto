import { z } from 'zod';
import type { Applicant, Application } from '@/api/types';

const NAME_MAX_LENGTH = 50;
const PHONE_CHARACTERS = /^[\d\s()+.-]+$/;

function getPhoneDigits(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits;
}

export function isValidPhone(value: string): boolean {
  return PHONE_CHARACTERS.test(value) && getPhoneDigits(value).length === 10;
}

export function formatPhone(value: string): string {
  const digits = getPhoneDigits(value);
  if (digits.length !== 10) return value.trim();
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const required = (message: string) => ({ message, abort: true });

export const applicantSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, required('Enter a first name'))
    .max(NAME_MAX_LENGTH, `First name must be ${NAME_MAX_LENGTH} characters or fewer`),
  lastName: z
    .string()
    .trim()
    .min(1, required('Enter a last name'))
    .max(NAME_MAX_LENGTH, `Last name must be ${NAME_MAX_LENGTH} characters or fewer`),
  email: z
    .string()
    .trim()
    .min(1, required('Enter an email address'))
    .pipe(z.email('Enter an email address in the correct format, like name@example.com')),
  phone: z
    .string()
    .trim()
    .min(1, required('Enter a phone number'))
    .refine(isValidPhone, 'Enter a 10-digit phone number, like 514-555-0123'),
});

export type ApplicantFormValues = z.input<typeof applicantSchema>;

export const EMPTY_APPLICANT: Applicant = { firstName: '', lastName: '', email: '', phone: '' };

export function toApplicant(values: ApplicantFormValues): Applicant {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: formatPhone(values.phone),
  };
}

export function getMainApplicant(application: Application): Applicant | undefined {
  return application.applicants[0];
}

export function isApplicantComplete(applicant: unknown): applicant is Applicant {
  return applicantSchema.safeParse(applicant).success;
}

export function isApplicationComplete(application: Application): boolean {
  return isApplicantComplete(getMainApplicant(application));
}

export function getFullName(applicant: Applicant): string {
  return `${applicant.firstName} ${applicant.lastName}`.trim();
}

export function getApplicationReference(application: Application): string {
  return application.id.slice(0, 8).toUpperCase();
}

export function getCompleteApplications(applications: readonly Application[]): Application[] {
  return applications
    .filter(isApplicationComplete)
    .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt));
}
