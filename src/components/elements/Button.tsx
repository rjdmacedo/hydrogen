import clsx from 'clsx';
import React from 'react';
import {Link} from '@shopify/hydrogen';

export function Button({
  to = '',
  size = 'md', //
  type = 'button', //
  width = 'auto', //
  shape = null, //
  color = 'ghost', //
  active = false, //
  variant = null, //
  endIcon = null, //
  loading = false, //
  animation = false, //
  className = '', //
  startIcon = null, //
  responsive = true,
  disabled = false, //
  children,
  ...props
}: {
  to?: string;
  href?: null | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  width?: 'auto' | 'full';
  shape?: null | 'circle' | 'square';
  color?:
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost';
  active?: boolean;
  variant?: null | 'outline' | 'link';
  endIcon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  animation?: boolean;
  startIcon?: React.ReactNode;
  responsive?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  [key: string]: any;
}) {
  const styles = clsx(
    'btn',
    size && `btn-${size}`,
    width === 'full' && 'btn-block',
    shape && `btn-${shape}`,
    color && `btn-${color}`,
    active && 'btn-active',
    variant && `btn-${variant}`,
    loading && 'loading',
    !animation && 'no-animation',
    className,
  );

  const iconSize =
    size === 'xs' ? 4 : size === 'sm' ? 4 : size === 'md' ? 5 : 6;

  return to ? (
    <Link to={to} className={styles}>
      {startIcon && startIcon}
      {children}
      {endIcon && endIcon}
    </Link>
  ) : (
    <button
      type={type}
      disabled={disabled}
      className={styles}
      aria-disabled={disabled}
      {...props}
    >
      {startIcon && (
        <span className={`mr-1.5 h-${iconSize} w-${iconSize}`}>
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className={`ml-1.5 h-${iconSize} w-${iconSize}`}>{endIcon}</span>
      )}
    </button>
  );
}
