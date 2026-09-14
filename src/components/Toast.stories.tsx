import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { useToast } from './Toast';

function ToastDemo() {
  const toast = useToast();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <Button onClick={() => toast.success({ title: 'Application saved' })}>
        Show success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error({
            title: "We couldn't start your application",
            description: "We couldn't reach our servers. Check your connection and try again.",
          })
        }
      >
        Show error toast
      </Button>
    </div>
  );
}

const meta = {
  title: 'Components/Toast',
  component: ToastDemo,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToastDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Saved: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Show success toast' }),
    );
    await expect(
      within(canvasElement.ownerDocument.body).getByText('Application saved'),
    ).toBeVisible();
  },
};
