import {Suspense} from 'react';
import {
  gql,
  Seo,
  useShopQuery,
  useRouteParams,
  useLocalization,
  useServerAnalytics,
  ProductOptionsProvider,
  ShopifyAnalyticsConstants,
} from '@shopify/hydrogen';

import {getExcerpt} from '~/lib/utils';
import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {NotFound, Layout, ProductSwimlane} from '~/components/index.server';
import {
  Text,
  Heading,
  Section,
  ProductForm,
  ProductDetail,
  ProductGallery,
} from '~/components';

export default function Product() {
  const {handle} = useRouteParams();
  const {
    country: {isoCode: countryCode},
    language: {isoCode: languageCode},
  } = useLocalization();

  const {
    data: {product, shop},
  } = useShopQuery({
    preload: true,
    query: PRODUCT_QUERY,
    variables: {
      country: countryCode,
      language: languageCode,
      handle,
    },
  });

  if (!product) {
    return <NotFound type="product" />;
  }

  useServerAnalytics({
    shopify: {
      resourceId: product.id,
      pageType: ShopifyAnalyticsConstants.pageType.product,
    },
  });

  const {media, title, vendor, description, id} = product;
  const {shippingPolicy, refundPolicy} = shop;

  return (
    <Layout>
      <Suspense>
        <Seo type="product" data={product} />
      </Suspense>
      <ProductOptionsProvider data={product}>
        <Section padding="x" className="px-0">
          <div className="grid items-start md:gap-6 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
            <ProductGallery
              media={media.nodes}
              className="w-screen md:w-full lg:col-span-2"
            />
            <div className="sticky md:-mb-nav md:top-nav md:-translate-y-nav md:h-screen md:pt-nav hiddenScroll md:overflow-y-scroll">
              <section className="flex flex-col w-full max-w-xl gap-8 p-6 md:mx-auto md:max-w-sm md:px-0">
                <div className="grid gap-2">
                  <Heading as="h1" format className="whitespace-normal">
                    {title}
                  </Heading>
                  {vendor && (
                    <Text className={'opacity-50 font-medium'}>{vendor}</Text>
                  )}
                </div>
                <ProductForm />
                <div className="grid gap-4 py-4">
                  {description && (
                    <ProductDetail
                      title="Product Details"
                      content={description}
                    />
                  )}
                  {shippingPolicy?.body && (
                    <ProductDetail
                      title="Shipping"
                      content={getExcerpt(shippingPolicy.body)}
                      learnMore={`/policies/${shippingPolicy.handle}`}
                    />
                  )}
                  {refundPolicy?.body && (
                    <ProductDetail
                      title="Returns"
                      content={getExcerpt(refundPolicy.body)}
                      learnMore={`/policies/${refundPolicy.handle}`}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </Section>
        <Suspense>
          <ProductSwimlane title="Related Products" data={id} />
        </Suspense>
      </ProductOptionsProvider>
    </Layout>
  );
}

const PRODUCT_QUERY = gql`
  ${MEDIA_FRAGMENT}
  query Product(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      description
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 100) {
        nodes {
          id
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
          priceV2 {
            amount
            currencyCode
          }
          compareAtPriceV2 {
            amount
            currencyCode
          }
          sku
          title
          unitPrice {
            amount
            currencyCode
          }
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
`;
