import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Email',
    type: 'email',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '24rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithHint: Story = {
  args: {
    label: 'Phone number',
    type: 'tel',
    hint: '10-digit number, for example 514-555-0123',
  },
};

export const WithError: Story = {
  args: {
    defaultValue: 'jane@',
    error: 'Enter an email address in the correct format, like name@example.com',
  },
};
