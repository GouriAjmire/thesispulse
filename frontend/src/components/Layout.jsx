import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { site } from '../siteConfig.js';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Pulse Blog' },
  { to: '/formats', label: 'Formats' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQs' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="shell">
      <ScrollToTop />

      <header className="header">
        <div className="container header__row">
          <Logo />
          <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn--coral nav__cta">
              Get free quote
            </Link>
          </nav>
          <button
            className="burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div>
            <Logo light />
            <p className="footer__blurb">
              Research mentoring, biostatistics and publication support for MD, MS, DNB and Diploma residents
              across India.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/services">Services</Link>
            <Link to="/blog">Pulse Blog</Link>
            <Link to="/formats">Formats</Link>
            <Link to="/faq">FAQs</Link>
            <Link to="/reviews">Reviews</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin">Team login</Link>
          </div>
          <div>
            <h4>Talk to us</h4>
            <span>{site.hours}</span>
          </div>
        </div>
        <div className="container footer__legal">
          <p>
            ThesisPulse provides research mentoring and academic support. Clients remain responsible for
            following their institution's academic integrity policies and for the originality of their own work.
          </p>
          <p>&copy; {new Date().getFullYear()} ThesisPulse. All rights reserved.</p>
        </div>
      </footer>

      <a className="whatsapp" href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        Chat
      </a>
    </div>
  );
}
