import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';

const API_URL = 'https://api.github.com';
async function fetcher(path) {
  const res = await fetch(API_URL + path);
  const json = await res.json();
  return json;
}

export default function GithubStats({ repositoryName }) {
  const { data, error } = useSWR(`/repos/${repositoryName}`, fetcher);
  let content;

  if (error) content = <div>failed to load</div>;
  else if (!data) content = <div>loading...</div>;
  else content = <div>"{repositoryName}" stars: {data.stargazers_count}</div>;

  return <div data-test-id="live-stats">
    <header>Live stats</header>
    {content}
  </div>
}