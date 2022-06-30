import {useUrl} from '@shopify/hydrogen';

import {Section, Heading, FooterMenu, CountrySelector} from '~/components';
import type {EnhancedMenu} from '~/lib/utils';

/**
 * A server component that specifies the content of the footer on the website
 */
export function Footer({menu}: {menu?: EnhancedMenu}) {
  const {pathname} = useUrl();

  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : null;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] w-full grid-flow-row grid-cols-1 items-start gap-6 border-b py-8 px-6 
        md:grid-cols-2 md:gap-8 md:px-8 lg:gap-12 lg:px-12 lg:grid-cols-${itemsCount}
        overflow-hidden bg-primary text-contrast dark:bg-contrast dark:text-primary`}
    >
      <FooterMenu menu={menu} />
      <section className="grid w-full gap-4 md:ml-auto md:max-w-[335px]">
        <Heading size="lead" className="cursor-default" as="h3">
          Country
        </Heading>
        <CountrySelector />
      </section>
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project. This website is carbon&nbsp;neutral.
      </div>
    </Section>
  );
}
