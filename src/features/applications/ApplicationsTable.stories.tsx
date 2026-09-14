import type { Meta, StoryObj } from '@storybook/react-vite';
import { buildApplication, products } from '@/test/fixtures';
import { ApplicationsTable, ApplicationsTableSkeleton } from './ApplicationsTable';

const meta = {
  title: 'Applications/ApplicationsTable',
  component: ApplicationsTable,
  args: {
    productsById: new Map(products.map((product) => [product.id, product])),
    applications: [
      buildApplication({ id: '72d79c96', createdAt: '2026-09-14' }),
      buildApplication({
        id: 'e6ea5ba9',
        createdAt: '2026-09-10',
        productId: 12345,
        applicants: [
          {
            firstName: 'Marie-Ève',
            lastName: 'Gagnon-Tremblay',
            email: 'marie-eve.gagnon-tremblay@example.com',
            phone: '438-555-0199',
          },
        ],
      }),
      buildApplication({ id: '1adac478', productId: 99999 }),
    ],
  },
} satisfies Meta<typeof ApplicationsTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  globals: {
    viewport: { value: 'mobile1', isRotated: false },
  },
};

export const Loading: Story = {
  render: () => <ApplicationsTableSkeleton />,
};
