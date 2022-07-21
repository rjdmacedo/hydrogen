import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
  poweredByHeader: false,
  logger: {
    /* Logs the cache status of each stored entry: `PUT`, `HIT`, `MISS` or `STALE`. */
    showCacheApiStatus: true,
    /* Logs the cache control headers of the main document and its sub queries. */
    showCacheControlHeader: true,
    /* Logs the timeline of when queries are being requested, resolved, and rendered.
     * This is an experimental feature. As a result, functionality is subject to change.
     * You can provide feedback on this feature by submitting an issue in GitHub:
     * https://github.com/Shopify/hydrogen/issues.*/
    showQueryTiming: true,
    /* Logs warnings in your app if you're over-fetching data from the Storefront API.
     * This is an experimental feature. As a result, functionality is subject to change.
     * You can provide feedback on this feature by submitting an issue in GitHub:
     * https://github.com/Shopify/hydrogen/issues. */
    showUnusedQueryProperties: true,
  },
  shopify: {
    storeDomain: import.meta.env.VITE_STOREFRONT_DOMAIN || '',
    storefrontToken: import.meta.env.VITE_STOREFRONT_TOKEN || '',
    storefrontApiVersion: import.meta.env.VITE_STOREFRONT_API_VERSION || '',
    defaultCountryCode:
      import.meta.env.VITE_STOREFRONT_DEFAULT_COUNTRY_CODE || '',
    defaultLanguageCode:
      import.meta.env.VITE_STOREFRONT_DEFAULT_LANGUAGE_CODE || '',
  },
  session: CookieSessionStorage('__session', {
    /* Tells the browser that the cookie should only be sent to the server if it's within the defined path.  */
    path: '/',
    /* Whether to secure the cookie so that client-side JavaScript can't read the cookie. */
    httpOnly: true,
    /* Whether to secure the cookie so that the browser only sends the cookie over HTTPS.  */
    secure: import.meta.env.NODE_ENV === 'production',
    /* Declares that the cookie should be restricted to a first-party or same-site context.  */
    sameSite: 'Strict',
    /* The number of seconds until the cookie expires. */
    maxAge: 60 * 60 * 24 * 30,
  }),
});
