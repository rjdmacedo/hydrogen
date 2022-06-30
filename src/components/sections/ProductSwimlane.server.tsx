import {useMemo} from 'react';
import {ProductCard, Section} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {gql, useShopQuery, useLocalization} from '@shopify/hydrogen';
import type {
  Product,
  ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';

const mockProducts = new Array(12).fill('');

export function ProductSwimlane({
  data = mockProducts,
  title = 'Featured Products',
  count = 12,
  ...props
}: {
  data?: Product[] | string | undefined;
  title?: string;
  count?: number;
  [key: string]: any;
}) {
  const productCardsMarkup = useMemo(() => {
    // If the data is already provided, there's no need to query it, so we'll just return the data
    if (typeof data === 'object') {
      return <ProductCards products={data} />;
    }

    // If the data provided is a productId, we will query the productRecommendations API.
    // To make sure we have enough products for the swimlane, we'll combine the results with our top-selling products.
    if (typeof data === 'string') {
      return <RecommendedProducts productId={data} count={count} />;
    }

    // If no data is provided, we'll go and query the top products
    return <TopProducts count={count} />;
  }, [count, data]);

  return (
    <Section heading={title} padding="y" {...props}>
      <div className="swimlane hiddenScroll md:scroll-px-8 md:px-8 md:pb-8 lg:scroll-px-12 lg:px-12">
        {productCardsMarkup}
      </div>
    </Section>
  );
}

function ProductCards({products}: {products: Product[]}) {
  return (
    <>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className={'w-80 snap-start'}
        />
      ))}
    </>
  );
}

function RecommendedProducts({
  count,
  productId,
}: {
  count: number;
  productId: string;
}) {
  const {
    country: {isoCode: countryCode},
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data: products} = useShopQuery<{
    recommended: Product[];
    additional: ProductConnection;
  }>({
    query: RECOMMENDED_PRODUCTS_QUERY,
    variables: {
      count,
      productId,
      languageCode,
      countryCode,
    },
  });

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (product, index, array) =>
        array.findIndex((p) => p.id === product.id) === index,
    );

  const originalProduct = mergedProducts
    .map((product) => product.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return <ProductCards products={mergedProducts} />;
}

function TopProducts({count}: {count: number}) {
  const {
    data: {products},
  } = useShopQuery({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count,
    },
  });

  return <ProductCards products={products.nodes} />;
}

const RECOMMENDED_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations(
    $count: Int
    $productId: ID!
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

const TOP_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query topProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
