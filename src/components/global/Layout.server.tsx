import type React from 'react';
import type {Menu, Shop} from '@shopify/hydrogen/storefront-api-types';
import {useLocalization, useShopQuery, CacheLong, gql} from '@shopify/hydrogen';

import {parseMenu} from '~/lib/utils';
import {Footer} from '~/components/index.server';
import {Header, SettingsFloatingButton} from '~/components';

const HEADER_MENU_HANDLE = 'main-menu';
const FOOTER_MENU_HANDLE = 'footer';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({children}: {children: React.ReactNode}) {
  const {
    language: {isoCode: languageCode},
  } = useLocalization();

  const {data} = useShopQuery<{
    shop: Shop;
    headerMenu: Menu;
    footerMenu: Menu;
  }>({
    query: SHOP_QUERY,
    cache: CacheLong(),
    preload: '*',
    variables: {
      language: languageCode,
      headerMenuHandle: HEADER_MENU_HANDLE,
      footerMenuHandle: FOOTER_MENU_HANDLE,
    },
  });

  const shopName = data ? data.shop.name : 'Hydrogen Demo Store';

  /*
    Modify specific links/routes (optional)
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
    e.g here we map:
      - /blogs/news -> /news
      - /blog/news/blog-post -> /news/blog-post
      - /collections/all -> /products
  */
  const customPrefixes = {BLOG: '', CATALOG: 'products'};

  const headerMenu = data?.headerMenu
    ? parseMenu(data.headerMenu, customPrefixes)
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(data.footerMenu, customPrefixes)
    : undefined;

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <a href="#main-content" className="sr-only">
          Skip to content
        </a>

        <Header title={shopName} menu={headerMenu} />

        <main role="main" id="main-content" className="flex-grow">
          {children}
        </main>
      </div>

      <Footer menu={footerMenu} />

      <SettingsFloatingButton className="block lg:hidden" />
    </>
  );
}

const SHOP_QUERY = gql`
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      name
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      id
      items {
        ...MenuItem
        items {
          ...MenuItem
        }
      }
    }
  }
`;
