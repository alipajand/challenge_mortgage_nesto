import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { AlertCircleIcon, CheckCircleIcon } from './icons';

type AlertProps = {
  tone: 'success' | 'error';
  title: string;
  children?: ReactNode;
  action?: ReactNode;
};

export function Alert({ tone, title, children, action }: AlertProps) {
  const Icon = tone === 'success' ? CheckCircleIcon : AlertCircleIcon;

  return (
    <div
      role={tone === 'error' ? 'alert' : undefined}
      className={cx('alert', `alert-${tone}`)}
    >
      <Icon className="alert-icon" />
      <div className="alert-content">
        <p className="alert-title">{title}</p>
        {children && <div>{children}</div>}
        {action && <div className="alert-action">{action}</div>}
      </div>
    </div>
  );
}
