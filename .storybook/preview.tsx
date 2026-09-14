import '@fontsource-variable/inter';
import '../src/styles/index.css';
import type { Preview } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';
import { ToastProvider } from '@/components/Toast';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <ToastProvider>
          <Story />
        </ToastProvider>
      </MemoryRouter>
    ),
  ],
};

export default preview;
