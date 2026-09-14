import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ApiError } from '@/api/client';
import { applicant } from '@/test/fixtures';
import { ApplicantForm } from './ApplicantForm';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const meta = {
  title: 'Applications/ApplicantForm',
  component: ApplicantForm,
  tags: ['autodocs'],
  args: {
    submitLabel: 'Save applicant info',
    onSubmit: fn(() => wait(800)),
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '44rem' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ApplicantForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NewApplicant: Story = {};

export const ExistingApplicant: Story = {
  args: {
    defaultValues: applicant,
    submitLabel: 'Save changes',
  },
};

export const ValidationErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText('Email'), 'jane@');
    await userEvent.click(canvas.getByRole('button', { name: 'Save applicant info' }));
    await expect(await canvas.findByText('Enter a first name')).toBeVisible();
  },
};

export const SaveFails: Story = {
  args: {
    defaultValues: applicant,
    submitLabel: 'Save changes',
    onSubmit: fn(async () => {
      await wait(600);
      throw new ApiError('network');
    }),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(await canvas.findByRole('alert', {}, { timeout: 3000 })).toBeVisible();
  },
};
