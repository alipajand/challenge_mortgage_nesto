import type { Applicant, Application, Product } from '@/api/types';

const baseProduct: Product = {
  id: 0,
  name: '',
  family: 'STANDARD',
  type: 'FIXED',
  term: '5_YEAR',
  insurable: true,
  insurance: 'CONVENTIONAL',
  prepaymentOption: 'STANDARD',
  restrictionsOption: 'NO_RESTRICTIONS',
  restrictions: 'NO_NOTABLE_RESTRICTIONS',
  fixedPenaltySpread: 'SMALL_PENALTY',
  helocOption: 'HELOC_WITHOUT',
  helocDelta: 0,
  lenderName: 'nesto',
  lenderType: 'MONOLINE',
  rateHold: '120_DAYS',
  rate: 0,
  ratePrimeVariance: 0,
  bestRate: 0,
  created: '2021-06-07T13:30:38Z',
  updated: '2021-06-07T13:47:09Z',
};

export function buildProduct(overrides: Partial<Product> = {}): Product {
  return { ...baseProduct, ...overrides };
}

export const products: Product[] = [
  buildProduct({
    id: 12345,
    name: 'MCAP Value-Flex Variable Special',
    family: 'VALUE_FLEX',
    type: 'VARIABLE',
    restrictionsOption: 'SOME_RESTRICTIONS',
    restrictions: 'MCAP_VALUE_FLEX_RESTRICTIONS',
    rate: 1.45,
    ratePrimeVariance: -1.2,
    bestRate: 1.25,
  }),
  buildProduct({
    id: 12346,
    name: 'Standard',
    type: 'VARIABLE',
    insurable: false,
    prepaymentOption: 'ENHANCED',
    fixedPenaltySpread: 'BANK_PENALTY',
    lenderType: 'BIG_BANK',
    rate: 1.55,
    ratePrimeVariance: -1.15,
    bestRate: 1.45,
  }),
  buildProduct({
    id: 12347,
    name: 'MCAP Value-Flex Fixed Special',
    family: 'VALUE_FLEX',
    restrictionsOption: 'SOME_RESTRICTIONS',
    restrictions: 'MCAP_VALUE_FLEX_RESTRICTIONS',
    rateHold: '90_DAYS',
    rate: 2.24,
    bestRate: 2.04,
  }),
  buildProduct({
    id: 12348,
    name: 'Standard (Quick Close Special)',
    rateHold: '60_DAYS',
    rate: 2.24,
    bestRate: 2.14,
  }),
  buildProduct({ id: 12310, name: 'Standard', rate: 2.34, bestRate: 2.24 }),
  buildProduct({
    id: 12311,
    name: 'Standard Special',
    insurable: false,
    rate: 2.34,
    bestRate: 2.24,
  }),
];

export const applicant: Applicant = {
  firstName: 'Jane',
  lastName: 'Roy',
  email: 'jane.roy@example.com',
  phone: '514-555-0101',
};

export function buildApplication(overrides: Partial<Application> = {}): Application {
  return {
    id: 'f5b50f8b-a41a-4f14-871a-4b2f4436b740',
    type: 'NEW',
    createdAt: '2026-09-14',
    productId: 12347,
    applicants: [applicant],
    ...overrides,
  };
}
