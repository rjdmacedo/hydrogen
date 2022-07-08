import {
  gql,
  Seo,
  useShopQuery,
  useLocalization,
  useServerAnalytics,
  type HydrogenRequest,
  type HydrogenRouteProps,
  ShopifyAnalyticsConstants,
  type HydrogenApiRouteOptions,
} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {NotFound, Layout} from '~/components/index.server';
import {PageHeader, ProductGrid, Section, Text} from '~/components';

const pageBy = 48;

export default function Collection({params}: HydrogenRouteProps) {
  const {handle} = params;
  const {
    country: {isoCode: country},
    language: {isoCode: language},
  } = useLocalization();

  const {
    data: {collection},
  } = useShopQuery({
    preload: true,
    query: COLLECTION_QUERY,
    variables: {
      handle,
      pageBy,
      country,
      language,
    },
  });

  if (!collection) {
    return <NotFound type="collection" />;
  }

  useServerAnalytics({
    shopify: {
      pageType: ShopifyAnalyticsConstants.pageType.collection,
      resourceId: collection.id,
    },
  });

  return (
    <Layout>
      <Suspense>
        <Seo type="collection" data={collection} />
      </Suspense>
      <PageHeader heading={collection.title}>
        {collection?.description && (
          <div className="flex w-full items-baseline justify-between">
            <Text format width="narrow" as="p" className="inline-block">
              {collection.description}
            </Text>
          </div>
        )}
      </PageHeader>
      <Section>
        <ProductGrid
          key="collections"
          url={`/collections/${handle}?country=${country}`}
          collection={collection}
        />
      </Section>
    </Layout>
  );
}

// API endpoint that returns paginated products for this collection
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
  const url = new URL(request.url);

  const cursor = url.searchParams.get('cursor');
  const country = url.searchParams.get('country');
  const {handle} = params;

  return await queryShop({
    query: PAGINATE_COLLECTION_QUERY,
    variables: {
      handle,
      cursor,
      pageBy,
      country,
    },
  });
}

const COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionDetails(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $pageBy: Int!
    $cursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(first: $pageBy, after: $cursor) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const PAGINATE_COLLECTION_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionPage(
    $handle: String!
    $pageBy: Int!
    $cursor: String
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: $pageBy, after: $cursor) {
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
