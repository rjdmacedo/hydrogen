import React from 'react';
import {Input, PageHeader} from '~/components';
import {Layout} from '~/components/index.server';

export function SearchPage({
  children,
  searchTerm = '',
}: {
  children: React.ReactNode;
  searchTerm?: string;
}) {
  return (
    <Layout>
      <PageHeader>
        <form className="relative flex w-full text-heading">
          <Input
            defaultValue={searchTerm}
            placeholder="Search"
            type="search"
            variant="search"
            name="q"
          />
          <button className="btn btn-primary" type="submit">
            Go
          </button>
        </form>
      </PageHeader>
      {children}
    </Layout>
  );
}
