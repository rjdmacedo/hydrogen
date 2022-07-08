import React, {useState} from 'react';
import {Button, useDrawer} from '~/components';
import {CogIcon} from '@heroicons/react/outline';
import {SettingsDrawer} from '~/components/global/SettingsDrawer.client';

export function SettingsFloatingButton({className = ''}: {className?: string}) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();

  return (
    <div className={className}>
      <div className="fixed right-2 bottom-2 z-40">
        <Button shape="circle" color="primary" onClick={openDrawer}>
          <CogIcon className="h-6 w-6" />
        </Button>
      </div>
      <SettingsDrawer isOpen={isOpen} onClose={closeDrawer} />
    </div>
  );
}
