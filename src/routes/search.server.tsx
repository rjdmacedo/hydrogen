import {
  gql,
  useUrl,
  useShopQuery,
  useLocalization,
  HydrogenRequest,
  type HydrogenRouteProps,
  type HydrogenApiRouteOptions,
} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {PAGINATION_SIZE} from '~/lib/const';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {ProductGrid, Section, Text} from '~/components';
import {NoResultRecommendations, SearchPage} from '~/components/index.server';

export default function Search({
  params,
  pageBy = PAGINATION_SIZE,
}: {
  pageBy?: number;
  params: HydrogenRouteProps['params'];
}) {
  const {
    country: {isoCode: countryCode},
    language: {isoCode: languageCode},
  } = useLocalization();

  const {handle} = params;
  const {searchParams} = useUrl();

  const searchTerm = searchParams.get('q');

  const {data} = useShopQuery<any>({
    preload: true,
    query: SEARCH_QUERY,
    variables: {
      handle,
      pageBy,
      searchTerm,
      country: countryCode,
      language: languageCode,
    },
  });

  const products = data?.products;
  const noResults = products?.nodes?.length === 0;

  if (!searchTerm || noResults) {
    return (
      <SearchPage searchTerm={searchTerm ? decodeURI(searchTerm) : null}>
        {noResults && (
          <Section padding="x">
            <Text className="opacity-50">No results, try something else.</Text>
          </Section>
        )}
        <NoResultRecommendations
          country={countryCode}
          language={languageCode}
        />
      </SearchPage>
    );
  }

  return (
    <SearchPage searchTerm={decodeURI(searchTerm)}>
      <Section>
        <ProductGrid
          key="search"
          url={`/search?country=${countryCode}&q=${searchTerm}`}
          collection={{products} as Collection}
        />
      </Section>
    </SearchPage>
  );
}

// API to paginate the results of the search query.
// @see templates/demo-store/src/components/product/ProductGrid.client.tsx
export async function api(
  request: HydrogenRequest,
  {params, queryShop}: HydrogenApiRouteOptions,
) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {Allow: 'POST'},
    });
  }

  const {handle} = params;

  const url = new URL(request.url);
  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const searchTerm = url.searchParams.get('q');

  return await queryShop({
    query: PAGINATE_SEARCH_QUERY,
    variables: {
      handle,
      cursor,
      country,
      searchTerm,
      pageBy: PAGINATION_SIZE,
    },
  });
}

const SEARCH_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query search(
    $pageBy: Int!
    $after: String
    $searchTerm: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      after: $after
      first: $pageBy
      query: $searchTerm
      sortKey: RELEVANCE
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

const PAGINATE_SEARCH_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query ProductsPage(
    $pageBy: Int!
    $cursor: String
    $searchTerm: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(
      first: $pageBy
      after: $cursor
      sortKey: RELEVANCE
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
