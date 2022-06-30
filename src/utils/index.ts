import {HydrogenRequest} from '@shopify/hydrogen';
import {cookiesKey, defaultSettings} from '~/config';
import type {SettingsValueProps} from '~/types/settings';

export const getSettings = (
  cookies: HydrogenRequest['cookies'],
): SettingsValueProps => {
  const themeMode =
    getData(cookies.get(cookiesKey.themeMode)) || defaultSettings.themeMode;

  return {
    themeMode,
  };
};

const getData = (value?: string) => {
  if (value === 'true' || value === 'false') {
    return JSON.parse(value);
  }
  if (value === 'undefined' || !value) {
    return '';
  }
  return value;
};
