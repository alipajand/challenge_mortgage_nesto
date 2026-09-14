import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { cx } from '@/lib/cx';
import { AlertCircleIcon, CheckCircleIcon, CloseIcon } from './icons';

type ToastOptions = {
  title: string;
  description?: string;
};

type ToastApi = {
  success: (options: ToastOptions) => void;
  error: (options: ToastOptions) => void;
};

type Toast = ToastOptions & { id: number; tone: 'success' | 'error' };

const MAX_TOASTS = 3;
const ToastContext = createContext<ToastApi | null>(null);

let nextId = 0;

export function useToast(): ToastApi {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error('useToast must be used inside a <ToastProvider>');
  }
  return toast;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const api = useMemo<ToastApi>(() => {
    const show = (tone: Toast['tone']) => (options: ToastOptions) => {
      nextId += 1;
      const toast = { ...options, tone, id: nextId };
      setToasts((current) => [...current, toast].slice(-MAX_TOASTS));
    };
    return { success: show('success'), error: show('error') };
  }, []);

  return (
    <ToastContext value={api}>
      {children}
      <ol role="list" aria-live="polite" className="toast-list">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </ol>
    </ToastContext>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timeout = window.setTimeout(
      () => onDismiss(toast.id),
      toast.tone === 'error' ? 8000 : 5000,
    );
    return () => window.clearTimeout(timeout);
  }, [onDismiss, toast.id, toast.tone]);

  const Icon = toast.tone === 'success' ? CheckCircleIcon : AlertCircleIcon;

  return (
    <li className={cx('toast', `toast-${toast.tone}`)}>
      <Icon className="toast-icon" />
      <div>
        <p className="toast-title">{toast.title}</p>
        {toast.description && <p className="toast-description">{toast.description}</p>}
      </div>
      <button
        type="button"
        className="toast-dismiss"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
      >
        <CloseIcon />
      </button>
    </li>
  );
}
