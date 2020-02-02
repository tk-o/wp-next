export default function FinderPage({ page = {} }) {
  return <article data-test-id="finder-page">
    <h1>{page.title}</h1>
    <div data-test-id="finder-page-content" dangerouslySetInnerHTML={{ __html: page.content }} />
  </article>
}
