import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

function Trigger() {
  const toast = useToast();
  return (
    <>
      <button type="button" onClick={() => toast.success({ title: 'Application saved' })}>
        Success
      </button>
      <button
        type="button"
        onClick={() => toast.error({ title: 'Not saved', description: 'Try again later.' })}
      >
        Error
      </button>
    </>
  );
}

function renderToasts() {
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );
}

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows a toast in a live region and hides it after a few seconds', () => {
    vi.useFakeTimers();
    renderToasts();

    fireEvent.click(screen.getByRole('button', { name: 'Success' }));

    const toast = screen.getByText('Application saved');
    expect(toast.closest('[aria-live="polite"]')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Application saved')).not.toBeInTheDocument();
  });

  it('keeps error toasts a little longer', () => {
    vi.useFakeTimers();
    renderToasts();

    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Try again later.')).toBeInTheDocument();
  });

  it('can be dismissed right away', () => {
    renderToasts();

    fireEvent.click(screen.getByRole('button', { name: 'Error' }));
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

    expect(screen.queryByText('Not saved')).not.toBeInTheDocument();
  });

  it('shows at most three toasts', () => {
    renderToasts();

    for (let index = 0; index < 5; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Success' }));
    }

    expect(screen.getAllByText('Application saved')).toHaveLength(3);
  });

  it('throws a helpful error when used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Trigger />)).toThrow('useToast must be used inside a <ToastProvider>');
  });
});
