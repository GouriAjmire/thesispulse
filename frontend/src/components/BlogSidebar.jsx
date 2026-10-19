import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatDate, useApi } from '../api.js';
import Newsletter from './Newsletter.jsx';

export default function BlogSidebar({ activeCategory, activeYear, activeMonth, initialQuery = '' }) {
  const navigate = useNavigate();
  const [q, setQ] = useState(initialQuery);
  const cats = useApi(() => api.categories(), []);
  const recent = useApi(() => api.recentPosts(3), []);
  const archives = useApi(() => api.archives(), []);

  function search(e) {
    e.preventDefault();
    navigate(q.trim() ? `/blog?q=${encodeURIComponent(q.trim())}` : '/blog');
  }

  return (
    <aside className="sidebar">
      <form className="widget" onSubmit={search} role="search">
        <h4>Search</h4>
        <div className="search">
          <input
            type="search"
            placeholder="Search guides..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search guides"
          />
          <button className="btn btn--ink btn--sm">Go</button>
        </div>
      </form>

      <div className="widget">
        <h4>Categories</h4>
        <ul className="list">
          {(cats.data || []).map((c) => (
            <li key={c.id}>
              <Link to={`/blog?category=${c.slug}`} className={activeCategory === c.slug ? 'active' : ''}>
                {c.name} <span>({c.postCount})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="widget">
        <h4>Recent posts</h4>
        <ul className="recent">
          {(recent.data || []).map((p) => (
            <li key={p.id}>
              <Link to={`/blog/${p.slug}`}>{p.title}</Link>
              <small>{formatDate(p.publishedOn)}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="widget">
        <h4>Archives</h4>
        <ul className="list">
          {(archives.data || []).map((a) => (
            <li key={`${a.year}-${a.month}`}>
              <Link
                to={`/blog?year=${a.year}&month=${a.month}`}
                className={Number(activeYear) === a.year && Number(activeMonth) === a.month ? 'active' : ''}
              >
                {a.label} <span>({a.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Newsletter variant="card" />
    </aside>
  );
}
