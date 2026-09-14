import { describe, expect, it } from 'vitest';
import { buildProduct, products } from '@/test/fixtures';
import { getBestProducts } from './getBestProducts';

const ids = (items: { id: number }[]) => items.map((item) => item.id);

describe('getBestProducts', () => {
  it('returns the product with the lowest best rate for each type', () => {
    expect(ids(getBestProducts(products, 'FIXED'))).toEqual([12347]);
    expect(ids(getBestProducts(products, 'VARIABLE'))).toEqual([12345]);
  });

  it('returns every product tied for the lowest rate, in API order', () => {
    const tied = [
      buildProduct({ id: 1, type: 'FIXED', bestRate: 2.24 }),
      buildProduct({ id: 2, type: 'FIXED', bestRate: 1.99 }),
      buildProduct({ id: 3, type: 'VARIABLE', bestRate: 1.5 }),
      buildProduct({ id: 4, type: 'FIXED', bestRate: 1.99 }),
    ];

    expect(ids(getBestProducts(tied, 'FIXED'))).toEqual([2, 4]);
  });

  it('compares the best rate, not the posted rate', () => {
    const items = [
      buildProduct({ id: 1, type: 'FIXED', rate: 1.5, bestRate: 2.5 }),
      buildProduct({ id: 2, type: 'FIXED', rate: 3, bestRate: 2 }),
    ];

    expect(ids(getBestProducts(items, 'FIXED'))).toEqual([2]);
  });

  it('returns an empty list when no product of that type exists', () => {
    const fixedOnly = products.filter((product) => product.type === 'FIXED');

    expect(getBestProducts(fixedOnly, 'VARIABLE')).toEqual([]);
    expect(getBestProducts([], 'FIXED')).toEqual([]);
  });

  it('ignores products without a usable rate', () => {
    const items = [
      buildProduct({ id: 1, type: 'FIXED', bestRate: Number.NaN }),
      buildProduct({ id: 2, type: 'FIXED', bestRate: 2.1 }),
    ];

    expect(ids(getBestProducts(items, 'FIXED'))).toEqual([2]);
  });
});
