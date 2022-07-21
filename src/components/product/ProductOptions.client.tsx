import React, {useCallback, useState} from 'react';
// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Listbox} from '@headlessui/react';
import {useProductOptions} from '@shopify/hydrogen';

import {Text, IconCheck, IconCaret} from '~/components';

export function ProductOptions({values, ...props}: ProductOptionsProps) {
  const asDropdown = values.length > 7;

  return asDropdown ? (
    <OptionsDropdown values={values} {...props} />
  ) : (
    <OptionsGrid values={values} {...props} />
  );
}

function OptionsGrid({name, values, handleChange}: ProductOptionsGridProps) {
  const {selectedOptions} = useProductOptions();

  return (
    <>
      {values.map((value) => {
        const id = `option-${name}-${value}`;
        const checked = selectedOptions![name] === value;

        return (
          <Text as="label" key={id} htmlFor={id}>
            <input
              id={id}
              type="radio"
              name={`option[${name}]`}
              value={value}
              checked={checked}
              className="sr-only"
              onChange={() => handleChange(name, value)}
            />
            <div
              className={`badge cursor-pointer leading-none transition-all duration-200 ${
                checked && 'badge-primary'
              }`}
            >
              {value}
            </div>
          </Text>
        );
      })}
    </>
  );
}

// TODO: De-dupe UI with CountrySelector
function OptionsDropdown({
  name,
  values,
  handleChange,
}: ProductOptionsDropdownProps) {
  const {selectedOptions} = useProductOptions();
  const [listBoxOpen, setListBoxOpen] = useState(false);

  const updateSelectedOption = useCallback(
    (value: string) => {
      handleChange(name, value);
    },
    [name, handleChange],
  );

  return (
    <div className="relative w-full">
      <Listbox onChange={updateSelectedOption} value="">
        {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
        {({open}) => {
          setTimeout(() => setListBoxOpen(open));
          return (
            <>
              <Listbox.Button
                className={`flex w-full items-center justify-between border border-primary py-3 px-4 ${
                  open ? 'rounded-b md:rounded-t md:rounded-b-none' : 'rounded'
                }`}
              >
                <span>{selectedOptions![name]}</span>
                <IconCaret direction={open ? 'up' : 'down'} />
              </Listbox.Button>

              <Listbox.Options
                className={`bg-contrast absolute bottom-12 z-30 grid h-48
                w-full overflow-y-scroll rounded-t border border-primary px-2 py-2 transition-[max-height]
                duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b ${
                  listBoxOpen ? 'max-h-48' : 'max-h-0'
                }`}
              >
                {values.map((value) => {
                  const isSelected = selectedOptions![name] === value;
                  const id = `option-${name}-${value}`;

                  return (
                    <Listbox.Option key={id} value={value}>
                      {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
                      {({active}) => (
                        <div
                          className={`flex w-full cursor-pointer items-center justify-start rounded p-2 text-left text-primary transition ${
                            active ? 'bg-primary/10' : null
                          }`}
                        >
                          {value}
                          {isSelected ? (
                            <span className="ml-2">
                              <IconCheck />
                            </span>
                          ) : null}
                        </div>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}

type ProductOptionsProps = {
  values: any[];
  [key: string]: any;
} & React.ComponentProps<typeof OptionsGrid>;

type ProductOptionsGridProps = {
  values: string[];
  name: string;
  handleChange: (name: string, value: string) => void;
};

type ProductOptionsDropdownProps = {
  name: string;
  values: string[];
  handleChange: (name: string, value: string) => void;
};
