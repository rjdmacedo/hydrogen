import {Suspense} from 'react';
import Cookies from 'js-cookie';
import {cookiesExpires, cookiesKey} from '~/config';
import SettingsContext from '~/contexts/SettingsContext.client';

import type {
  ThemeMode,
  SettingsValueProps,
  SettingsContextProps,
} from '~/types/settings';

import React, {
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

export default function SettingsProvider({
  children,
  defaultSettings,
}: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const onOSChangeMode = (e: MediaQueryListEvent) => {
    setSettings({
      ...settings,
      themeMode: e.matches ? 'dark' : 'light',
    });
  };

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    });
  };

  const onChangeMode = (
    event: React.ChangeEvent<HTMLInputElement> | 'light' | 'dark',
  ) => {
    setSettings({
      ...settings,
      themeMode:
        typeof event === 'string'
          ? event
          : ((event.target as HTMLInputElement).value as ThemeMode),
    });
  };

  // **************************************** Reset
  const onResetSetting = () => {
    setSettings({
      themeMode: defaultSettings.themeMode,
    });
  };

  useEffect(() => {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', onOSChangeMode);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', onOSChangeMode);
    };
  });

  const value: SettingsContextProps = {
    themeMode: settings.themeMode,
    onChangeMode,
    onResetSetting,
    onToggleMode,
  };

  return (
    <Suspense>
      <SettingsContext.Provider value={value}>
        {children}
      </SettingsContext.Provider>
    </Suspense>
  );
}

function useSettingCookies(
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(cookiesKey.themeMode, settings.themeMode, {
      expires: cookiesExpires,
    });
    document
      .getElementsByTagName('html')[0]
      .setAttribute('data-theme', settings.themeMode);
  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [settings, setSettings];
}

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};
