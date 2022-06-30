import {Link, Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Section, Grid} from '~/components';

export function FeaturedCollections({
  data,
  title = 'Collections',
  ...props
}: {
  data: Collection[];
  title?: string;
  [key: string]: any;
}) {
  const haveCollections = data.length > 0;
  const quantityOfProductsWithImages = data.filter((item) => item.image).length;

  if (!haveCollections) return null;

  return (
    <Section {...props} heading={title}>
      <Grid items={quantityOfProductsWithImages}>
        {data.map((collection) => {
          if (!collection?.image) {
            return null;
          }
          // TODO: Refactor to use CollectionCard
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}>
              <div className="grid gap-4">
                <div className="card-image aspect-[3/2] bg-primary/5">
                  {collection?.image && (
                    <Image
                      width={600}
                      height={400}
                      data={collection.image}
                      alt={`Image of ${collection.title}`}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      widths={[400, 500, 600, 700, 800, 900]}
                      loaderOptions={{scale: 2, crop: 'center'}}
                    />
                  )}
                </div>
                <Heading size="copy">{collection.title}</Heading>
              </div>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}
