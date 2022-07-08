import {Button, Drawer} from '~/components';
import {MoonIcon, SunIcon} from '@heroicons/react/outline';
import {useSettings} from '~/contexts/SettingsContext.client';

export function SettingsDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {themeMode, onChangeMode} = useSettings();

  return (
    <Drawer
      open={isOpen}
      width="min"
      onClose={onClose}
      heading="Settings"
      openFrom="right"
    >
      <div className="grid gap-4 p-4 sm:p-6">
        <div className="flex flex-col">
          <div className="flex items-center justify-around gap-2">
            <Button
              active={themeMode === 'dark'}
              variant="outline"
              onClick={() => onChangeMode('dark')}
              className="w-1/2"
            >
              <MoonIcon className="h-6 w-6" />
            </Button>
            <Button
              active={themeMode === 'light'}
              variant="outline"
              onClick={() => onChangeMode('light')}
              className="w-1/2"
            >
              <SunIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
