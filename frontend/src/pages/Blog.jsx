import { Link, useSearchParams } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';
import PostCard from '../components/PostCard.jsx';
import BlogSidebar from '../components/BlogSidebar.jsx';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const q = params.get('q') || '';
  const year = params.get('year') || '';
  const month = params.get('month') || '';
  const page = Math.max(parseInt(params.get('page') || '0', 10) || 0, 0);

  const cats = useApi(() => api.categories(), []);
  const posts = useApi(
    () => api.posts({ category, q, year, month, page, size: 6 }),
    [category, q, year, month, page]
  );

  const activeCat = (cats.data || []).find((c) => c.slug === category);
  let title = 'Pulse blog';
  if (activeCat) title = activeCat.name;
  else if (q) title = `Search: ${q}`;
  else if (year && month) title = `${MONTHS[Number(month) - 1] || ''} ${year}`;

  const trail = [{ label: 'Blog', to: title === 'Pulse blog' ? undefined : '/blog' }];
  if (title !== 'Pulse blog') trail.push({ label: title });

  function goTo(p) {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      <PageHeader title={title} trail={trail} lead={activeCat?.description} />
      <section className="section">
        <div className="container blog-layout">
          <div>
            {posts.loading && <Loading />}
            {posts.error && <ErrorBox error={posts.error} onRetry={posts.reload} />}
            {posts.data && posts.data.items.length === 0 && (
              <div className="state">
                <p>No guides match that filter yet.</p>
                <Link to="/blog" className="btn btn--ink btn--sm">See all guides</Link>
              </div>
            )}
            {posts.data && posts.data.items.length > 0 && (
              <>
                <div className="grid grid--2">
                  {posts.data.items.map((p) => <PostCard key={p.id} post={p} />)}
                </div>
                {posts.data.totalPages > 1 && (
                  <nav className="pager" aria-label="Pagination">
                    <button className="btn btn--ghost btn--sm" disabled={page === 0} onClick={() => goTo(page - 1)}>
                      &larr; Newer
                    </button>
                    <span>Page {posts.data.page + 1} of {posts.data.totalPages}</span>
                    <button
                      className="btn btn--ghost btn--sm"
                      disabled={page + 1 >= posts.data.totalPages}
                      onClick={() => goTo(page + 1)}
                    >
                      Older &rarr;
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
          <BlogSidebar activeCategory={category} activeYear={year} activeMonth={month} initialQuery={q} />
        </div>
      </section>
    </>
  );
}
