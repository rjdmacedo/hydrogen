import {
  gql,
  HydrogenResponse,
  useLocalization,
  useShopQuery,
} from '@shopify/hydrogen';

import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {Button, FeaturedCollections, PageHeader, Text} from '~/components';
import {ProductSwimlane, Layout} from '~/components/index.server';
import type {
  CollectionConnection,
  ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';

export function NotFound({
  type = 'page',
  response,
}: {
  type?: string;
  response?: HydrogenResponse;
}) {
  if (response) {
    response.doNotStream();
    response.status = 404;
    response.statusText = 'Not found';
  }

  const {
    country: {isoCode: countryCode},
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data} = useShopQuery<{
    featuredProducts: ProductConnection;
    featuredCollections: CollectionConnection;
  }>({
    preload: true,
    query: NOT_FOUND_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
    },
  });

  const heading = `We’ve lost this ${type}`;
  const description = `We couldn’t find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;
  const {featuredProducts, featuredCollections} = data;
  return (
    <Layout>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button width="auto" color="primary" to="/">
          Take me to the home page
        </Button>
      </PageHeader>
      {featuredCollections.nodes.length < 2 && (
        <FeaturedCollections
          title="Popular Collections"
          data={featuredCollections.nodes}
        />
      )}
      <ProductSwimlane data={featuredProducts.nodes} />
    </Layout>
  );
}

const NOT_FOUND_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query homepage($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
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
    featuredProducts: products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
