import {defaultSettings} from '~/config';
import {createContext, useContext} from 'react';
import {SettingsContextProps} from '~/types/settings';

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},
  // Reset
  onResetSetting: () => {},
};

const SettingsContext = createContext(initialState);

export default SettingsContext;

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('No settings context found');
  }

  return context;
}
