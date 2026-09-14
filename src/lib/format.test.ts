import { describe, expect, it } from 'vitest';
import { formatDate, formatRate, parseApiDate, parseEnumAmount, pluralize } from './format';

describe('formatRate', () => {
  it('always shows two decimals', () => {
    expect(formatRate(2.04)).toBe('2.04%');
    expect(formatRate(1.2)).toBe('1.20%');
  });
});

describe('parseApiDate', () => {
  it('reads date-only values as local dates, so the day never shifts', () => {
    const date = parseApiDate('2026-09-14');

    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(8);
    expect(date?.getDate()).toBe(14);
  });

  it('supports full timestamps and rejects invalid values', () => {
    expect(parseApiDate('2021-06-07T13:30:38Z')?.toISOString()).toBe('2021-06-07T13:30:38.000Z');
    expect(parseApiDate('not a date')).toBeUndefined();
  });
});

describe('formatDate', () => {
  it('formats API dates', () => {
    expect(formatDate('2026-09-14')).toBe('Sep 14, 2026');
  });

  it('falls back to the raw value when it cannot be parsed', () => {
    expect(formatDate('soon')).toBe('soon');
  });
});

describe('parseEnumAmount', () => {
  it('reads the amount from API enums', () => {
    expect(parseEnumAmount('5_YEAR')).toBe(5);
    expect(parseEnumAmount('120_DAYS')).toBe(120);
    expect(parseEnumAmount('OPEN')).toBeUndefined();
  });
});

describe('pluralize', () => {
  it('uses the singular for one', () => {
    expect(pluralize(1, 'year')).toBe('1 year');
    expect(pluralize(5, 'year')).toBe('5 years');
  });
});
