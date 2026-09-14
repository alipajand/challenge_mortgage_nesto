const LOCALE = 'en-CA';
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

export function parseApiDate(value: string): Date | undefined {
  const match = DATE_ONLY_PATTERN.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(value: string): string {
  const date = parseApiDate(value);
  return date ? new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' }).format(date) : value;
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { timeStyle: 'short' }).format(date);
}

export function parseEnumAmount(value: string): number | undefined {
  const amount = Number.parseInt(value, 10);
  return Number.isNaN(amount) ? undefined : amount;
}

export function pluralize(count: number, unit: string): string {
  return `${count} ${count === 1 ? unit : `${unit}s`}`;
}
