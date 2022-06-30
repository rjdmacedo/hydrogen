import {Product} from '@shopify/hydrogen/storefront-api-types';
import {ProductCard} from '../cards/ProductCard.client';

export function ProductCards({products}: {products: Product[]}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          product={product}
          key={product.id}
          className={'w-80 snap-start'}
        />
      ))}
    </>
  );
}
