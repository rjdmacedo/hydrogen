import {
  useCart,
  useCartLine,
  CartLineQuantityAdjustButton,
  CartLinePrice,
  CartLineQuantity,
  Image,
  Link,
} from '@shopify/hydrogen';
import type {Image as ImageType} from '@shopify/hydrogen/storefront-api-types';

import {Heading, IconRemove, Text} from '~/components';

export function CartLineItem() {
  const {linesRemove} = useCart();
  const {id: lineId, quantity, merchandise} = useCartLine();

  return (
    <li key={lineId} className="flex gap-4">
      <div className="flex-shrink">
        <Image
          width={112}
          height={112}
          widths={[112]}
          data={merchandise.image as ImageType}
          loaderOptions={{
            scale: 2,
            crop: 'center',
          }}
          className="h-24 w-24 rounded border object-cover object-center md:h-28 md:w-28"
        />
      </div>

      <div className="flex flex-grow justify-between">
        <div className="grid gap-2">
          <Heading as="h3" size="copy">
            <Link to={`/products/${merchandise.product.handle}`}>
              {merchandise.product.title}
            </Link>
          </Heading>

          <div className="grid pb-2">
            {(merchandise?.selectedOptions || []).map((option) => (
              <Text color="subtle" key={option.name}>
                {option.name}: {option.value}
              </Text>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex justify-start text-copy">
              <CartLineQuantityAdjust lineId={lineId} quantity={quantity} />
            </div>
            <button
              type="button"
              onClick={() => linesRemove([lineId])}
              className="flex h-10 w-10 items-center justify-center rounded border"
            >
              <span className="sr-only">Remove</span>
              <IconRemove aria-hidden="true" />
            </button>
          </div>
        </div>
        <Text>
          <CartLinePrice as="span" />
        </Text>
      </div>
    </li>
  );
}

function CartLineQuantityAdjust({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  return (
    <>
      <label htmlFor={`quantity-${lineId}`} className="sr-only">
        Quantity, {quantity}
      </label>
      <div className="flex items-center rounded border">
        <CartLineQuantityAdjustButton
          adjust="decrease"
          aria-label="Decrease quantity"
          className="h-10 w-10 text-primary/50 transition hover:text-primary disabled:cursor-wait"
        >
          &#8722;
        </CartLineQuantityAdjustButton>
        <CartLineQuantity as="div" className="px-2 text-center" />
        <CartLineQuantityAdjustButton
          adjust="increase"
          aria-label="Increase quantity"
          className="h-10 w-10 text-primary/50 transition hover:text-primary disabled:cursor-wait"
        >
          &#43;
        </CartLineQuantityAdjustButton>
      </div>
    </>
  );
}
