import { describe, expect, it } from 'vitest';
import { applicant, buildApplication } from '@/test/fixtures';
import {
  applicantSchema,
  formatPhone,
  getApplicationReference,
  getCompleteApplications,
  isApplicantComplete,
  isApplicationComplete,
  isValidPhone,
  toApplicant,
} from './applicant';

describe('phone numbers', () => {
  it.each(['514-555-0101', '(514) 555-0101', '514.555.0101', '5145550101', '+1 514 555 0101'])(
    'accepts %s',
    (value) => {
      expect(isValidPhone(value)).toBe(true);
    },
  );

  it.each(['555-0101', '514-555-01011', '2 514 555 0101', '514-555-O101', 'call me'])(
    'rejects %s',
    (value) => {
      expect(isValidPhone(value)).toBe(false);
    },
  );

  it('formats valid numbers consistently', () => {
    expect(formatPhone('(514) 555 0101')).toBe('514-555-0101');
    expect(formatPhone('+1 514.555.0101')).toBe('514-555-0101');
  });

  it('leaves numbers it cannot format as typed', () => {
    expect(formatPhone(' 555-0101 ')).toBe('555-0101');
  });
});

function messagesFor(values: Record<string, string>) {
  const result = applicantSchema.safeParse(values);
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
}

describe('applicantSchema', () => {
  it('accepts a complete applicant', () => {
    expect(applicantSchema.safeParse(applicant).success).toBe(true);
  });

  it('asks for every missing field', () => {
    expect(messagesFor({ firstName: '', lastName: ' ', email: '', phone: '' })).toEqual({
      firstName: 'Enter a first name',
      lastName: 'Enter a last name',
      email: 'Enter an email address',
      phone: 'Enter a phone number',
    });
  });

  it('flags badly formatted values', () => {
    expect(
      messagesFor({ ...applicant, email: 'jane@', phone: '555', firstName: 'J'.repeat(51) }),
    ).toEqual({
      firstName: 'First name must be 50 characters or fewer',
      email: 'Enter an email address in the correct format, like name@example.com',
      phone: 'Enter a 10-digit phone number, like 514-555-0123',
    });
  });

  it('accepts names with accents, apostrophes and hyphens', () => {
    expect(
      applicantSchema.safeParse({ ...applicant, firstName: 'Zoë-Hélène', lastName: "O'Brien" })
        .success,
    ).toBe(true);
  });
});

describe('toApplicant', () => {
  it('trims values and normalizes the phone number', () => {
    expect(
      toApplicant({
        firstName: '  Jane ',
        lastName: ' Roy',
        email: ' jane.roy@example.com ',
        phone: '514 555 0101',
      }),
    ).toEqual(applicant);
  });
});

describe('application completeness', () => {
  it('requires a valid main applicant', () => {
    expect(isApplicantComplete(applicant)).toBe(true);
    expect(isApplicantComplete({ ...applicant, email: 'not-an-email' })).toBe(false);
    expect(isApplicantComplete(undefined)).toBe(false);

    expect(isApplicationComplete(buildApplication())).toBe(true);
    expect(isApplicationComplete(buildApplication({ applicants: [] }))).toBe(false);
  });

  it('keeps complete applications only, most recent first', () => {
    const older = buildApplication({ id: 'older', createdAt: '2026-08-01' });
    const newer = buildApplication({ id: 'newer', createdAt: '2026-09-10' });
    const incomplete = buildApplication({
      id: 'incomplete',
      createdAt: '2026-09-12',
      applicants: [{ firstName: '', lastName: '', email: '', phone: '' }],
    });

    expect(getCompleteApplications([older, incomplete, newer]).map((app) => app.id)).toEqual([
      'newer',
      'older',
    ]);
  });

  it('builds a short reference from the id', () => {
    expect(getApplicationReference(buildApplication({ id: '72d79c96-6ed3-4444' }))).toBe(
      '72D79C96',
    );
  });
});
