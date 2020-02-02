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
      <GithubStats repositoryName="tk-o/wp-next" />
      <FinderPage page={page} />
    </Fragment>
  );
}

export async function unstable_getStaticPaths() {
  return [
    { params: { country: 'uk', all: ['credit-cards'] } },
    { params: { country: 'us', all: ['cell-phones'] } },
    { params: { country: 'au', all: ['ebay-discount-code'] } },
  ];
}

export async function unstable_getStaticProps({ params }) {
  const { country, all } = params;

  return getPageProps({ country, all })
}

async function getPageProps({ country, all }) {
  const getItemURLFor = taxonomy =>
    getTaxonomyItemURL({
      taxonomy,
      country,
      slug: all.join('/'),
      fields: ['id', 'title', 'content'],
    });

  let apiResponse;

  for (let taxonomy of ['pages', 'posts']) {
    const url = getItemURLFor(taxonomy);

    console.log('calling', url);

    apiResponse = await fetcher(url);

    if (hasTaxonomyItem(apiResponse)) {
      break;
    }
  }

  if (!hasTaxonomyItem(apiResponse)) {
    throw Error('Not found');
  }

  const [page] = apiResponse;
  const id = page.id;
  const title = page.title.rendered;
  const content = page.content.rendered;

  return {
    props: {
      page: {
        id,
        title,
        content,
      },
    },
  };
}
