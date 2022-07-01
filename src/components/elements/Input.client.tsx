import clsx from 'clsx';
import {HTMLInputTypeAttribute} from 'react';
import {useSettings} from '~/contexts/SettingsContext.client';

export function Input({
  size = 'md',
  type = 'text',
  className = '',
  ...props
}: {
  className?: string;
  type?: HTMLInputTypeAttribute | undefined;
  size?: 'sm' | 'md' | 'lg';
  [key: string]: any;
}) {
  const {themeMode} = useSettings();
  const isDark = themeMode === 'dark';

  const sizes = {
    sm: 'py-1',
    md: 'py-2',
    lg: 'py-3',
  };

  const styles = clsx(
    className,
    sizes[size],
    `appearance-none border-1 rounded-lg bg-transparent placeholder-opacity-70 ${
      isDark
        ? 'border-gray-300 placeholder-white'
        : 'border-gray-700 placeholder-gray-700'
    }`,
  );

  return <input type={type} {...props} className={styles} />;
}
