import type { MortgageType, Product } from '@/api/types';

export const MORTGAGE_TYPES: readonly MortgageType[] = ['FIXED', 'VARIABLE'];

export function getBestProducts(products: readonly Product[], type: MortgageType): Product[] {
  const candidates = products.filter(
    (product) => product.type === type && Number.isFinite(product.bestRate),
  );

  if (candidates.length === 0) return [];

  const lowestRate = Math.min(...candidates.map((product) => product.bestRate));
  return candidates.filter((product) => product.bestRate === lowestRate);
}
