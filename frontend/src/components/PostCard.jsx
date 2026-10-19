import { Link } from 'react-router-dom';
import { formatDate } from '../api.js';

/** Stable accent per category so cards are recognisable without needing images. */
const ACCENTS = {
  'topic-selection': ['#0FA3A3', '#0B1F3A'],
  'data-analysis': ['#3B82F6', '#0B1F3A'],
  'protocol-iec': ['#F59E0B', '#7C2D12'],
  publishing: ['#8B5CF6', '#1E1B4B'],
  'resident-life': ['#FF6B57', '#4A1D1F'],
};

export function coverStyle(slug) {
  const [a, b] = ACCENTS[slug] || ['#0FA3A3', '#0B1F3A'];
  return { background: `linear-gradient(135deg, ${b} 0%, ${a} 140%)` };
}

export default function PostCard({ post, compact = false }) {
  return (
    <article className={`post-card ${compact ? 'post-card--compact' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="post-card__cover" style={coverStyle(post.categorySlug)} aria-hidden="true" tabIndex={-1}>
        <svg viewBox="0 0 200 60" preserveAspectRatio="none">
          <path d="M0 34h58l10-22 16 40 14-30 8 12h94" fill="none" stroke="rgba(255,255,255,.55)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{post.categoryName}</span>
      </Link>
      <div className="post-card__body">
        <ul className="meta">
          <li>{formatDate(post.publishedOn)}</li>
          <li>{post.readMinutes} min read</li>
        </ul>
        <h3>
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {!compact && <p>{post.excerpt}</p>}
        <Link to={`/blog/${post.slug}`} className="link-arrow">
          Read more <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
