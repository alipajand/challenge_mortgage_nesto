import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import { ArrowLeftIcon } from './icons';

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  backLink?: { to: string; label: string };
  align?: 'start' | 'center';
};

export function PageHeader({
  title,
  description,
  eyebrow,
  status,
  actions,
  meta,
  backLink,
  align = 'start',
}: PageHeaderProps) {
  return (
    <header className={cx('page-header', align === 'center' && 'page-header-center')}>
      {backLink && (
        <Link to={backLink.to} className="page-header-back">
          <ArrowLeftIcon />
          {backLink.label}
        </Link>
      )}
      <div className="page-header-body">
        <div className="page-header-text">
          {eyebrow && <p className="page-header-eyebrow">{eyebrow}</p>}
          <div className="page-header-title-row">
            <h1 className="page-header-title">{title}</h1>
            {status}
          </div>
          {description && <p className="page-header-description">{description}</p>}
          {meta && <div className="page-header-meta">{meta}</div>}
        </div>
        {actions}
      </div>
    </header>
  );
}
