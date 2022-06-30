import React, {Fragment, useState} from 'react';
import {XIcon} from '@heroicons/react/outline';
// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Dialog, Transition} from '@headlessui/react';

import {Heading} from '~/components';
import {useSettings} from '~/contexts/SettingsContext.client';

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
function Drawer({
  open,
  heading,
  onClose,
  children,
  openFrom = 'right',
}: {
  open: boolean;
  heading?: string;
  onClose: () => void;
  children: React.ReactNode;
  openFrom: 'right' | 'left';
}) {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };
  const {themeMode, onToggleMode} = useSettings();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`pointer-events-none fixed inset-y-0 flex max-w-full ${
                openFrom === 'right' ? 'right-0' : ''
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-base-100">
                  <div className="flex h-full flex-col overflow-y-scroll py-6 shadow-xl">
                    <header className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        {heading !== null && (
                          <Dialog.Title>
                            <Heading as="span" size="lead" id="cart-contents">
                              {heading}
                            </Heading>
                          </Dialog.Title>
                        )}
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="text-primary transition hover:text-primary/50"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </header>
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export {Drawer};

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}
