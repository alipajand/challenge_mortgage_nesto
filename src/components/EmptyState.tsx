import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Button } from './Button';
import { AlertCircleIcon } from './icons';

type HeadingLevel = 'h1' | 'h2' | 'h3';

type EmptyStateProps = {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'error';
  headingLevel?: HeadingLevel;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  tone = 'neutral',
  headingLevel: Heading = 'h2',
}: EmptyStateProps) {
  return (
    <div className={cx('empty-state', tone === 'error' && 'empty-state-error')}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <Heading className="empty-state-title">{title}</Heading>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

type ErrorStateProps = {
  title: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
  headingLevel?: HeadingLevel;
};

export function ErrorState({ title, message, onRetry, isRetrying, headingLevel }: ErrorStateProps) {
  return (
    <div role="alert">
      <EmptyState
        tone="error"
        icon={<AlertCircleIcon />}
        title={title}
        description={message}
        headingLevel={headingLevel}
        action={
          <Button variant="secondary" onClick={onRetry} isLoading={isRetrying}>
            Try again
          </Button>
        }
      />
    </div>
  );
}
