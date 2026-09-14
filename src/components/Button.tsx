import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cx } from '@/lib/cx';

type ButtonStyleProps = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

function buttonClassName(
  { variant = 'primary', size = 'md', fullWidth = false }: ButtonStyleProps,
  className?: string,
) {
  return cx(
    'button',
    `button-${variant}`,
    size !== 'md' && `button-${size}`,
    fullWidth && 'button-full',
    className,
  );
}

type ButtonProps = ComponentPropsWithRef<'button'> &
  ButtonStyleProps & {
    isLoading?: boolean;
    loadingText?: ReactNode;
  };

export function Button({
  variant,
  size,
  fullWidth,
  isLoading = false,
  loadingText,
  type = 'button',
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isLoading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, fullWidth }, className)}
      aria-disabled={isLoading || undefined}
      onClick={handleClick}
      {...props}
    >
      {isLoading && <span className="spinner" aria-hidden="true" />}
      {isLoading ? (loadingText ?? children) : children}
    </button>
  );
}

type ButtonLinkProps = LinkProps & ButtonStyleProps;

export function ButtonLink({ variant, size, fullWidth, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName({ variant, size, fullWidth }, className)} {...props} />;
}
