import { Fragment } from 'react';
import dynamic from 'next/dynamic';
import fetch from 'isomorphic-unfetch';

import { hasTaxonomyItem, getTaxonomyItemURL } from '../../../helpers/taxonomy';

async function fetcher(path) {
  const res = await fetch(path);
  const json = await res.json();
  return json;
}

const FinderPage = dynamic(() => import('../../../components/finder-page'));
const GithubStats = dynamic(() => import('../../../components/github-stats'));

export default function CanaryIndexPage({ page }) {
  return (
    <Fragment>
      <GithubStats repositoryName="zeit/next.js" />
      <FinderPage page={page} />
    </Fragment>
  );
}

CanaryIndexPage.getInitialProps = async context => {
  const { country, all } = context.query;

  const getItemURLFor = taxonomy =>
    getTaxonomyItemURL({
      taxonomy,
      country,
      slug: all.join('/'),
      fields: ['id', 'title', 'content'],
    });

  let apiResponse = await fetcher(getItemURLFor('page'));

  if (!hasTaxonomyItem(apiResponse)) {
    apiResponse = await fetcher(getItemURLFor('posts'));
  }

  if (!hasTaxonomyItem(apiResponse)) {
    throw Error('Not found');
  }

  const [page] = apiResponse;
  const id = page.id;
  const title = page.title.rendered;
  const content = page.content.rendered;

  return {
    page: {
      id,
      title,
      content,
    },
  };
};
