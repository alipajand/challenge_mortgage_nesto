import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { buildProduct } from '@/test/fixtures';
import { ProductCard } from './ProductCard';

const fixedProduct = buildProduct({
  id: 12347,
  name: 'MCAP Value-Flex Fixed Special',
  family: 'VALUE_FLEX',
  restrictionsOption: 'SOME_RESTRICTIONS',
  rateHold: '90_DAYS',
  bestRate: 2.04,
});

const meta = {
  title: 'Products/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  args: {
    product: fixedProduct,
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '26rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fixed: Story = {};

export const Variable: Story = {
  args: {
    product: buildProduct({
      id: 12345,
      name: 'MCAP Value-Flex Variable Special',
      type: 'VARIABLE',
      restrictionsOption: 'SOME_RESTRICTIONS',
      bestRate: 1.25,
    }),
  },
};

export const Selecting: Story = {
  args: { isSelecting: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const Summary: Story = {
  args: { onSelect: undefined },
};
