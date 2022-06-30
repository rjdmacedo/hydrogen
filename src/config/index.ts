import {SettingsValueProps} from '~/types/settings';

export const cookiesExpires = 3;

export const cookiesKey = {
  themeMode: 'themeMode',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch',
  themeContrast: 'themeContrast',
  themeDirection: 'themeDirection',
  themeColorPresets: 'themeColorPresets',
};

export const defaultSettings: SettingsValueProps = {
  themeMode: 'light',
};
