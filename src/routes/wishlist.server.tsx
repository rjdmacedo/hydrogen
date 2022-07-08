import {Suspense} from 'react';
import {Seo} from '@shopify/hydrogen';
import {Layout} from '~/components/index.server';
import {PageHeader, Section} from '~/components';

export default function Wishlist() {
  return (
    <Layout>
      <Suspense>
        <Seo
          type="page"
          data={{
            title: 'Wishlist',
          }}
        />
      </Suspense>
      <div className="mx-auto w-full max-w-7xl xl:-translate-x-12">
        <PageHeader heading="Your Wishlist" />
      </div>
      <Section padding="x">TODO: Wishlist</Section>
    </Layout>
  );
}
