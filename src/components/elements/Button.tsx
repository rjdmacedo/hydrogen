import clsx from 'clsx';
import React from 'react';
import {Link} from '@shopify/hydrogen';
import {missingClass} from '~/lib/utils';

export function Button({
  as = 'button',
  width = 'auto',
  circle = false,
  variant = 'primary',
  className = '',
  ...props
}: {
  as?: React.ElementType;
  width?: 'auto' | 'full';
  circle?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  [key: string]: any;
}) {
  const Component = props?.to ? Link : as;

  const baseButtonClasses = 'btn';

  const variants = {
    primary: `${baseButtonClasses} btn-primary`,
    secondary: `${baseButtonClasses} btn-secondary`,
  };

  const widths = {
    auto: 'w-auto',
    full: 'btn-block',
  };

  const styles = clsx(
    missingClass(className, 'bg-') && variants[variant],
    missingClass(className, 'w-') && widths[width],
    className,
  );

  return <Component className={styles} {...props} />;
}
