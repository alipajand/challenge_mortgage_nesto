import type { Meta, StoryObj } from '@storybook/react-vite';
import { ButtonLink } from './Button';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    title: 'Get the lowest rate on your first try',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {
  args: {
    align: 'center',
    description:
      "Compare today's best fixed and variable mortgage rates, then pick the one that suits you to start your application.",
  },
};

export const WithStatusAndMeta: Story = {
  args: {
    backLink: { to: '/', label: 'Back to rates' },
    eyebrow: 'Step 2 of 2',
    title: 'Complete your application',
    status: <span className="badge badge-warning">Incomplete</span>,
    description: "Add the main applicant's contact information to finish your application.",
    meta: (
      <>
        <span>Reference 72D79C96</span>
        <span>Created Sep 14, 2026</span>
      </>
    ),
  },
};

export const WithAction: Story = {
  args: {
    title: 'Applications',
    description: 'Review completed applications and keep applicant details up to date.',
    meta: <span>3 applications</span>,
    actions: <ButtonLink to="/">New application</ButtonLink>,
  },
};
