import { useId } from 'react';
import type { Product } from '@/api/types';
import { Button } from '@/components/Button';
import { ArrowRightIcon } from '@/components/icons';
import { cx } from '@/lib/cx';
import { parseEnumAmount, pluralize } from '@/lib/format';

const PREPAYMENT_LABELS: Partial<Record<string, string>> = {
  STANDARD: 'Standard',
  ENHANCED: 'Enhanced',
};

const RESTRICTION_LABELS: Partial<Record<string, string>> = {
  NO_RESTRICTIONS: 'None',
  SOME_RESTRICTIONS: 'Some',
  MORE_RESTRICTIONS: 'More',
};

type ProductCardProps = {
  product: Product;
  onSelect?: (product: Product) => void;
  isSelecting?: boolean;
  isDisabled?: boolean;
};

export function ProductCard({
  product,
  onSelect,
  isSelecting = false,
  isDisabled = false,
}: ProductCardProps) {
  const nameId = useId();
  const type = product.type.toLowerCase();
  const years = parseEnumAmount(product.term);
  const rateHoldDays = parseEnumAmount(product.rateHold);

  const details: [label: string, value: string][] = [
    ['Term', years === undefined ? product.term : pluralize(years, 'year')],
    ['Rate hold', rateHoldDays === undefined ? product.rateHold : pluralize(rateHoldDays, 'day')],
    ['Prepayment', PREPAYMENT_LABELS[product.prepaymentOption] ?? product.prepaymentOption],
    ['Restrictions', RESTRICTION_LABELS[product.restrictionsOption] ?? product.restrictionsOption],
  ];

  return (
    <article aria-labelledby={nameId} className={cx('product-card', `product-card-${type}`)}>
      <div>
        <p className="product-card-headline">
          {years === undefined ? type : `${years}-year ${type}`}
        </p>
        <h3 id={nameId} className="product-card-name">
          {product.name}
        </h3>
      </div>

      <div>
        <p className="rate">
          {product.bestRate.toFixed(2)}
          <span className="rate-percent">%</span>
        </p>
        <p className="product-card-label">Best rate</p>
      </div>

      <dl className="product-card-details">
        {details.map(([label, value]) => (
          <div key={label} className="product-card-detail">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {onSelect && (
        <Button
          size="lg"
          fullWidth
          className="product-card-action"
          isLoading={isSelecting}
          loadingText="Starting your application…"
          disabled={isDisabled && !isSelecting}
          onClick={() => onSelect(product)}
        >
          Select this product
          <span className="visually-hidden">: {product.name}</span>
          <ArrowRightIcon />
        </Button>
      )}
    </article>
  );
}
