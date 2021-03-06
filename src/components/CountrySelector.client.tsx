import {useMemo} from 'react';
// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import {Listbox} from '@headlessui/react';
import {IconCheck, IconCaret} from '~/components';
import {useCallback, useState, Suspense} from 'react';
import {useLocalization, fetchSync} from '@shopify/hydrogen';
import type {
  Country,
  CountryCode,
} from '@shopify/hydrogen/storefront-api-types';

/**
 * A client component that selects the appropriate country to display for products on a website
 */
export function CountrySelector() {
  const {
    country: {isoCode},
  } = useLocalization();
  const [listBoxOpen, setListBoxOpen] = useState(false);
  const currentCountry = useMemo<CurrentCountry>(() => {
    const regionNamesInEnglish = new Intl.DisplayNames(['en'], {
      type: 'region',
    });

    return {
      name: regionNamesInEnglish.of(isoCode)!,
      isoCode: isoCode as CountryCode,
    };
  }, [isoCode]);

  const setCountry = useCallback<SetCountryParams>(
    ({isoCode: newIsoCode}) => {
      const currentPath = window.location.pathname;
      let redirectPath;

      if (newIsoCode !== 'US') {
        if (currentCountry.isoCode === 'US') {
          redirectPath = `/${newIsoCode.toLowerCase()}${currentPath}`;
        } else {
          redirectPath = `/${newIsoCode.toLowerCase()}${currentPath.substring(
            currentPath.indexOf('/', 1),
          )}`;
        }
      } else {
        redirectPath = `${currentPath.substring(currentPath.indexOf('/', 1))}`;
      }

      window.location.href = redirectPath;
    },
    [currentCountry],
  );

  return (
    <div className="relative">
      <Listbox onChange={setCountry}>
        {({open}: {open: boolean}) => {
          setTimeout(() => setListBoxOpen(open));
          return (
            <>
              <Listbox.Button
                className={`flex w-full items-center justify-between border py-3 px-4 ${
                  open ? 'rounded-b md:rounded-t md:rounded-b-none' : 'rounded'
                } border-contrast/30 dark:border-white`}
              >
                <span className="">{currentCountry.name}</span>
                <IconCaret direction={open ? 'up' : 'down'} />
              </Listbox.Button>

              <Listbox.Options
                className={`absolute bottom-12 z-10 grid h-48
                w-full overflow-y-scroll rounded-t border bg-base-300 px-2 py-2
                transition-[max-height] duration-150 sm:bottom-auto md:rounded-b
                md:rounded-t-none md:border-t-0 md:border-b ${
                  listBoxOpen ? 'max-h-48' : 'max-h-0'
                }`}
              >
                {listBoxOpen && (
                  <Suspense fallback={<div className="p-2">Loading???</div>}>
                    {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
                    <Countries
                      selectedCountry={currentCountry}
                      getClassName={(active) => {
                        return `w-full p-2 transition rounded 
                        flex justify-start items-center text-left cursor-pointer ${
                          active ? 'bg-primary/10' : null
                        }`;
                      }}
                    />
                  </Suspense>
                )}
              </Listbox.Options>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}

export function Countries({getClassName, selectedCountry}: CountriesProps) {
  const countries: Country[] = fetchSync('/api/countries').json();

  return (countries || []).map((country) => {
    const isSelected = country.isoCode === selectedCountry.isoCode;

    return (
      <Listbox.Option key={country.isoCode} value={country}>
        {/* @ts-expect-error @headlessui/react incompatibility with node16 resolution */}
        {({active}) => (
          <div className={getClassName(active)}>
            {country.name}
            {isSelected ? (
              <span className="ml-2">
                <IconCheck />
              </span>
            ) : null}
          </div>
        )}
      </Listbox.Option>
    );
  });
}

type CurrentCountry = {name: string; isoCode: CountryCode};
type SetCountryParams = (country: Country) => void;
type CountriesProps = {
  getClassName: (active: boolean) => string;
  selectedCountry: Pick<Country, 'isoCode' | 'name'>;
};
