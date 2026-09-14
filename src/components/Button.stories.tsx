import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, ButtonLink } from './Button';
import { ArrowRightIcon } from './icons';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Select this product',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const LargeWithIcon: Story = {
  args: {
    size: 'lg',
    children: (
      <>
        Select this product
        <ArrowRightIcon />
      </>
    ),
  },
};

export const Loading: Story = {
  args: { isLoading: true, loadingText: 'Starting your application…' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsLink: Story = {
  render: () => (
    <ButtonLink to="/applications" variant="secondary" size="sm">
      View all applications
    </ButtonLink>
  ),
};
