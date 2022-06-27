import {defineConfig, CookieSessionStorage} from '@shopify/hydrogen/config';

export default defineConfig({
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
