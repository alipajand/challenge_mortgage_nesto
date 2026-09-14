import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ButtonLink } from './Button';
import { EmptyState, ErrorState } from './EmptyState';
import { FolderIcon } from './icons';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    icon: <FolderIcon />,
    title: 'No applications yet',
    description:
      "Applications show up here once the main applicant's name, email and phone number are saved.",
    action: <ButtonLink to="/">Browse rates</ButtonLink>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithRetry: StoryObj<typeof ErrorState> = {
  render: (args) => <ErrorState {...args} />,
  args: {
    title: "We couldn't load today's rates",
    message: "We couldn't reach our servers. Check your internet connection and try again.",
    onRetry: fn(),
  },
};
