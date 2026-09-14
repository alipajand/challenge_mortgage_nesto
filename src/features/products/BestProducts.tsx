import type { MortgageType, Product } from '@/api/types';
import { EmptyState } from '@/components/EmptyState';
import { getBestProducts, MORTGAGE_TYPES } from './getBestProducts';
import { ProductCard } from './ProductCard';

const SECTIONS: Record<MortgageType, { title: string; description: string; empty: string }> = {
  FIXED: {
    title: 'Best fixed rate',
    description: 'Your rate and payments stay the same for the whole term.',
    empty: 'No fixed-rate products are available right now.',
  },
  VARIABLE: {
    title: 'Best variable rate',
    description: 'Your rate follows the prime rate, so it can go down or up during the term.',
    empty: 'No variable-rate products are available right now.',
  },
};

type BestProductsProps = {
  products: readonly Product[];
  onSelect: (product: Product) => void;
  selectingProductId?: number;
};

export function BestProducts({ products, onSelect, selectingProductId }: BestProductsProps) {
  return (
    <div className="products-grid">
      {MORTGAGE_TYPES.map((type) => {
        const section = SECTIONS[type];
        const bestProducts = getBestProducts(products, type);
        const headingId = `best-${type.toLowerCase()}`;

        return (
          <section key={type} aria-labelledby={headingId} className="products-section">
            <header className="products-section-header">
              <h2 id={headingId} className="products-section-title">
                {section.title}
              </h2>
              <p className="products-section-description">{section.description}</p>
            </header>

            {bestProducts.length === 0 ? (
              <EmptyState headingLevel="h3" title={section.empty} />
            ) : (
              <ul role="list" className="products-list">
                {bestProducts.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      onSelect={onSelect}
                      isSelecting={selectingProductId === product.id}
                      isDisabled={selectingProductId !== undefined}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function BestProductsSkeleton() {
  return (
    <div className="products-grid" aria-busy="true">
      <p role="status" className="visually-hidden">
        Loading today's best rates…
      </p>
      {MORTGAGE_TYPES.map((type) => (
        <div key={type} className="products-section">
          <div className="skeleton skeleton-row" />
          <div className="skeleton skeleton-card" />
        </div>
      ))}
    </div>
  );
}
