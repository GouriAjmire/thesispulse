import { Link } from 'react-router-dom';
import { site } from '../siteConfig.js';

export function PulseMark({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--ink)" />
      <path
        d="M6 34h12l6-16 10 30 8-22 4 8h12"
        fill="none"
        stroke="var(--teal-300)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label={`${site.name} home`}>
      <PulseMark />
      <span className="logo__text">
        Thesis<b>Pulse</b>
      </span>
    </Link>
  );
}
