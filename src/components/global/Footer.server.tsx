import {useUrl} from '@shopify/hydrogen';

import {Section, Heading, FooterMenu, CountrySelector} from '~/components';
import type {EnhancedMenu} from '~/lib/utils';
import {isHome} from '~/utils';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';

/**
 * A server component that specifies the content of the footer on the website
 */
export function Footer({menu}: {menu?: EnhancedMenu}) {
  const {pathname} = useUrl();

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? (localeMatch[1] as CountryCode) : undefined;

  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  const styles = {
    container: `grid min-h-[25rem] w-full grid-flow-row grid-cols-1 items-start md:grid-cols-2 md:gap-8 md:px-8
    lg:gap-12 lg:grid-cols-${itemsCount} bg-base-200`,
  };

  return (
    <Section
      as="footer"
      role="contentinfo"
      divider={isHome(pathname, countryCode) ? 'none' : 'top'}
      className={styles.container}
    >
      <section className="grid w-full gap-4">
        <Heading size="lead" className="cursor-default" as="h3">
          Country
        </Heading>
        <CountrySelector />
      </section>

      <FooterMenu menu={menu} />

      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()}
      </div>
    </Section>
  );
}
