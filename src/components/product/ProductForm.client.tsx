import {
  Money,
  useUrl,
  isBrowser,
  AddToCartButton,
  OptionWithValues,
  useProductOptions,
} from '@shopify/hydrogen';
import {useEffect, useCallback, useState} from 'react';
import {Heading, Text, Button, ProductOptions} from '~/components';

export function ProductForm() {
  const {pathname, search} = useUrl();
  const [params, setParams] = useState(new URLSearchParams(search));

  const {options, setSelectedOption, selectedOptions, selectedVariant} =
    useProductOptions();

  const isOutOfStock = !selectedVariant?.availableForSale || false;
  const isOnSale =
    selectedVariant?.priceV2?.amount <
      selectedVariant?.compareAtPriceV2?.amount || false;

  useEffect(() => {
    if (params || !search) return;
    setParams(new URLSearchParams(search));
  }, [params, search]);

  useEffect(() => {
    (options as OptionWithValues[]).map(({name, values}) => {
      if (!params) return;
      const currentValue = params.get(name.toLowerCase()) || null;
      if (currentValue) {
        const matchedValue = values.filter(
          (value) => encodeURIComponent(value.toLowerCase()) === currentValue,
        );
        setSelectedOption(name, matchedValue[0]);
      } else {
        params.set(
          encodeURIComponent(name.toLowerCase()),
          encodeURIComponent(selectedOptions![name]!.toLowerCase()),
        );
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (name: string, value: string) => {
      setSelectedOption(name, value);
      if (!params) return;
      params.set(
        encodeURIComponent(name.toLowerCase()),
        encodeURIComponent(value.toLowerCase()),
      );
      if (isBrowser()) {
        window.history.replaceState(
          null,
          '',
          `${pathname}?${params.toString()}`,
        );
      }
    },
    [setSelectedOption, params, pathname],
  );

  function productHasOptionWithMultipleValues(
    options: OptionWithValues[] | null,
  ) {
    return (options || []).some((option) => {
      return option.values.length > 1;
    });
  }

  return (
    <form className="grid gap-10">
      {productHasOptionWithMultipleValues(options as OptionWithValues[]) && (
        <div className="grid gap-4">
          {(options as OptionWithValues[]).map(({name, values}) => (
            <div
              key={name}
              className="mb-4 flex flex-col flex-wrap gap-y-2 last:mb-0"
            >
              <Heading as="legend" size="lead" className="min-w-[4rem]">
                {name}
              </Heading>
              <div className="flex flex-wrap items-baseline gap-4">
                <ProductOptions
                  name={name}
                  values={values}
                  handleChange={handleChange}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="grid items-stretch gap-4">
        <AddToCartButton
          quantity={1}
          className="btn btn-primary"
          disabled={isOutOfStock}
          variantId={selectedVariant?.id}
          accessibleAddingToCartLabel="Adding item to your cart"
        >
          {isOutOfStock ? (
            <Text>Sold out</Text>
          ) : (
            <Text as="span" className="flex items-center justify-center gap-2">
              <span>Add to bag</span>
              <span>&middot;</span>
              <Money
                as="span"
                withoutTrailingZeros
                data={selectedVariant.priceV2!}
              />
              {isOnSale && (
                <Money
                  as="span"
                  withoutTrailingZeros
                  className="strike opacity-50"
                  data={selectedVariant.compareAtPriceV2!}
                />
              )}
            </Text>
          )}
        </AddToCartButton>
      </div>
    </form>
  );
}
