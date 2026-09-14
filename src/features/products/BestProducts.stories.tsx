import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { buildProduct, products } from '@/test/fixtures';
import { BestProducts, BestProductsSkeleton } from './BestProducts';

const meta = {
  title: 'Products/BestProducts',
  component: BestProducts,
  args: {
    products,
    onSelect: fn(),
  },
} satisfies Meta<typeof BestProducts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TiedRates: Story = {
  args: {
    products: [
      ...products,
      buildProduct({ id: 1, type: 'FIXED', name: 'Standard 5-Year Fixed', bestRate: 2.04 }),
    ],
  },
};

export const NoVariableProducts: Story = {
  args: { products: products.filter((product) => product.type === 'FIXED') },
};

export const Loading: Story = {
  render: () => <BestProductsSkeleton />,
};
