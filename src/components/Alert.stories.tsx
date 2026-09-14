import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { ButtonLink } from './Button';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '36rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    tone: 'success',
    title: 'Your application is complete',
    children: 'You can come back to it anytime from the Applications page.',
    action: (
      <ButtonLink to="/applications" variant="secondary" size="sm">
        View all applications
      </ButtonLink>
    ),
  },
};

export const Error: Story = {
  args: {
    tone: 'error',
    title: "Your changes weren't saved",
    children: "We couldn't reach our servers. Check your internet connection and try again.",
  },
};
