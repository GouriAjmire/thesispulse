import { Link } from 'react-router-dom';

export function Loading({ label = 'Loading...' }) {
  return (
    <div className="state" role="status">
      <span className="spinner" aria-hidden="true" /> {label}
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <p>{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="btn btn--ink btn--sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

/** Breadcrumb banner in the style of an editorial section header. */
export function PageHeader({ title, trail = [], lead }) {
  return (
    <section className="page-header">
      <div className="container">
        <h1>{title}</h1>
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">ThesisPulse</Link>
          {trail.map((t) => (
            <span key={t.label}>
              <i aria-hidden="true">/</i>
              {t.to ? <Link to={t.to}>{t.label}</Link> : t.label}
            </span>
          ))}
        </nav>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead, center = false }) {
  return (
    <div className={`section-head ${center ? 'section-head--center' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
}
