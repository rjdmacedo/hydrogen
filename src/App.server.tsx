import {Suspense} from 'react';
import renderHydrogen from '@shopify/hydrogen/entry-server';
import {CountryCode} from '@shopify/hydrogen/storefront-api-types';
import {
  Route,
  Router,
  FileRoutes,
  CartProvider,
  ShopifyProvider,
  ShopifyAnalytics,
  PerformanceMetrics,
  PerformanceMetricsDebug,
  type HydrogenRouteProps,
} from '@shopify/hydrogen';

import {getSettings} from '~/utils';
import {HeaderFallback} from '~/components';
import {DefaultSeo, NotFound} from '~/components/index.server';
import SettingsProvider from '~/providers/SettingsProvider.client';

function App({routes, request}: HydrogenRouteProps) {
  const pathname = new URL(request.normalizedUrl).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  const countryCode = localeMatch ? localeMatch[1] : undefined;

  const isHome = pathname === `/${countryCode ? countryCode + '/' : ''}`;

  const settings = getSettings(request.cookies);

  return (
    <Suspense fallback={<HeaderFallback isHome={isHome} />}>
      <SettingsProvider defaultSettings={settings}>
        <ShopifyProvider countryCode={countryCode as CountryCode}>
          <CartProvider countryCode={countryCode as CountryCode}>
            <Suspense>
              <DefaultSeo />
            </Suspense>
            <Router>
              <FileRoutes
                routes={routes}
                basePath={countryCode ? `/${countryCode}/` : undefined}
              />
              <Route path="*" page={<NotFound />} />
            </Router>
          </CartProvider>
          <PerformanceMetrics />
          {import.meta.env.DEV && <PerformanceMetricsDebug />}
          <ShopifyAnalytics />
        </ShopifyProvider>
      </SettingsProvider>
    </Suspense>
  );
}

export default renderHydrogen(App);
