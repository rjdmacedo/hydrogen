import React from 'react';

export type ThemeMode = 'light' | 'dark';

export type SettingsContextProps = {
  themeMode: ThemeMode;

  // Mode
  onToggleMode: VoidFunction;
  onChangeMode: (
    event: React.ChangeEvent<HTMLInputElement> | 'light' | 'dark',
  ) => void;

  // Reset
  onResetSetting: VoidFunction;
};

export type SettingsValueProps = {
  themeMode: ThemeMode;
};
