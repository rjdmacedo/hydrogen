import {Suspense} from 'react';
import {PAGINATION_SIZE} from '~/lib/const';
import {FeaturedCollections} from '~/components';
import {gql, useShopQuery} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {ProductSwimlane} from '~/components/index.server';
import type {Collection, Product} from '@shopify/hydrogen/storefront-api-types';

type SearchNoResultsQueryResponse = {
  featuredProducts: {
    nodes: Pick<
      Product,
      | 'id'
      | 'title'
      | 'handle'
      | 'publishedAt'
      | 'availableForSale'
      | 'variants'
    >[];
  };
  featuredCollections: {
    nodes: Pick<Collection, 'id' | 'title' | 'handle' | 'image'>[];
  };
};

export function NoResultRecommendations({
  country,
  language,
}: {
  country: string;
  language: string;
}) {
  const {data} = useShopQuery<SearchNoResultsQueryResponse>({
    query: SEARCH_NO_RESULTS_QUERY,
    variables: {
      country,
      language,
      pageBy: PAGINATION_SIZE,
    },
    preload: false,
  });

  return (
    <Suspense>
      <FeaturedCollections
        title="Trending Collections"
        data={data.featuredCollections.nodes as Collection[]}
      />
      <ProductSwimlane
        title="Trending Products"
        data={data.featuredProducts.nodes as Product[]}
      />
    </Suspense>
  );
}

const SEARCH_NO_RESULTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query searchNoResult(
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
  ) @inContext(country: $country, language: $language) {
    featuredCollections: collections(first: 3, sortKey: UPDATED_AT) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
    featuredProducts: products(first: $pageBy) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
