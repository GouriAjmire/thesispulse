import { Link } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { Loading, ErrorBox, SectionHead } from '../components/Ui.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import PostCard from '../components/PostCard.jsx';
import Accordion from '../components/Accordion.jsx';

const PROBLEMS = [
  { t: 'No research training', d: 'MBBS rarely covers biostatistics, research methodology or ICMR guidelines in any depth.' },
  { t: 'Almost no time', d: 'Twelve-hour duties and night calls leave little room for literature searches or protocol writing.' },
  { t: 'Guide is stretched too', d: 'Feedback can take weeks when your guide is busy with wards, OT and teaching.' },
  { t: 'Protocols get returned', d: 'Ethics committees send back protocols for avoidable gaps in consent, criteria and statistics.' },
];

const STEPS = [
  { t: 'Share your brief', d: 'Specialty, university, deadline and the kind of help you need.' },
  { t: 'Free briefing call', d: 'A short chat by call, email or WhatsApp to understand exactly where you are stuck.' },
  { t: 'Agree the plan', d: 'A clear quote, timeline and deliverables, confirmed in writing before work starts.' },
  { t: 'Work, review, refine', d: 'You receive drafts, give feedback and we revise until it is ready for your guide.' },
];

const PROMISES = [
  { t: 'Confidential by default', d: 'Your name, institution and research details are never shared or published.' },
  { t: 'Doctor-led mentoring', d: 'Mentors who understand clinical research, not just formatting and language.' },
  { t: 'University-aware formats', d: 'Familiar with the thesis formats used by major Indian health universities.' },
  { t: 'WhatsApp-friendly', d: 'Talk to your mentor the way you would to a helpful senior. No complicated portals.' },
  { t: 'Deadlines in writing', d: 'We agree a delivery date up front and plan backwards from your submission.' },
  { t: 'Revisions until approved', d: 'Guide wants changes? We incorporate them within the agreed scope.' },
];

function PulseLine() {
  return (
    <svg className="hero__pulse" viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
      <path
        className="hero__pulse-path"
        d="M0 70h140l24-48 36 100 30-80 22 28h348"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  const services = useApi(() => api.services(), []);
  const specialties = useApi(() => api.specialties(), []);
  const posts = useApi(() => api.recentPosts(3), []);
  const faqs = useApi(() => api.faqs(), []);

  const groups = {};
  (specialties.data || []).forEach((s) => {
    (groups[s.group] = groups[s.group] || []).push(s.name);
  });

  return (
    <>
      {/* ------------------------------------------------------------ hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <span className="pill">For MD, MS, DNB and Diploma residents across India</span>
            <h1>
              Give your thesis a <em>pulse</em>.
            </h1>
            <p className="hero__lead">
              Research mentoring from topic to publication: a feasible topic, an IEC-ready protocol, analysis you can
              explain in your viva, and a manuscript worth submitting.
            </p>
            <div className="hero__cta">
              <Link to="/contact" className="btn btn--coral btn--lg">Get a free quote</Link>
              <Link to="/services" className="btn btn--outline btn--lg">Explore services</Link>
            </div>
            <ul className="hero__stats">
              <li><b>24h</b><span>reply on every enquiry</span></li>
              <li><b>All India</b><span>university formats</span></li>
              <li><b>100%</b><span>confidential</span></li>
            </ul>
          </div>
          <div className="hero__panel" aria-hidden="true">
            <div className="monitor">
              <div className="monitor__head">
                <span>Thesis vitals</span>
                <i />
              </div>
              <PulseLine />
              <dl>
                <div><dt>Topic</dt><dd className="ok">Approved</dd></div>
                <div><dt>Protocol</dt><dd className="ok">IEC ready</dd></div>
                <div><dt>Analysis</dt><dd className="warn">In progress</dd></div>
                <div><dt>Submission</dt><dd>On schedule</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ problem */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Why residents struggle"
            title="The thesis problem every resident knows"
            lead="You are managing wards, OPDs and night calls, and somehow also expected to produce original research."
          />
          <div className="grid grid--4">
            {PROBLEMS.map((p, i) => (
              <div className="tile" key={p.t}>
                <span className="tile__idx">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ services */}
      <section className="section section--tint">
        <div className="container">
          <SectionHead
            eyebrow="What we offer"
            title="Pick one step, or take the whole pathway"
            lead="Every service is mentoring-first: you stay the investigator while we remove the roadblocks."
          />
          {services.loading && <Loading />}
          {services.error && <ErrorBox error={services.error} onRetry={services.reload} />}
          {services.data && (
            <div className="grid grid--3">
              {services.data.map((s) => (
                <ServiceCard key={s.id} service={s} showFeatures={false} />
              ))}
            </div>
          )}
          <p className="center muted">
            <Link to="/services" className="link-arrow">See what is included in each service &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ process */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="The process" title="Simple, fast, built around your duty roster" center />
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span>{i + 1}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ specialties */}
      <section className="section section--ink">
        <div className="container">
          <SectionHead
            eyebrow="We cover"
            title="Specialties we work in"
            lead="Do not see yours? Send an enquiry anyway. We support clinical and non-clinical disciplines."
          />
          {specialties.loading && <Loading />}
          {specialties.error && <ErrorBox error={specialties.error} onRetry={specialties.reload} />}
          <div className="spec-groups">
            {Object.entries(groups).map(([g, names]) => (
              <div key={g}>
                <h4>{g}</h4>
                <div className="chips">
                  {names.map((n) => <span key={n} className="chip">{n}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ promises */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Our promise" title="Why residents trust ThesisPulse" />
          <div className="grid grid--3">
            {PROMISES.map((p) => (
              <div className="promise" key={p.t}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ blog */}
      <section className="section section--tint">
        <div className="container">
          <div className="section-row">
            <SectionHead eyebrow="From the Pulse blog" title="Short guides you can use tonight" />
            <Link to="/blog" className="btn btn--ghost">All guides</Link>
          </div>
          {posts.loading && <Loading />}
          {posts.error && <ErrorBox error={posts.error} onRetry={posts.reload} />}
          {posts.data && (
            <div className="grid grid--3">
              {posts.data.map((p) => <PostCard key={p.id} post={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ faq */}
      <section className="section">
        <div className="container container--narrow">
          <SectionHead eyebrow="Frequently asked" title="Questions residents ask" center />
          {faqs.loading && <Loading />}
          {faqs.error && <ErrorBox error={faqs.error} onRetry={faqs.reload} />}
          {faqs.data && <Accordion items={faqs.data.slice(0, 4)} />}
          <p className="center">
            <Link to="/faq" className="link-arrow">More questions &rarr;</Link>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------ cta */}
      <section className="cta">
        <div className="container cta__row">
          <div>
            <h2>Ready to begin?</h2>
            <p>Fill a two-minute form. We reply within 24 hours with honest advice on what is feasible.</p>
          </div>
          <Link to="/contact" className="btn btn--coral btn--lg">Start your enquiry</Link>
        </div>
      </section>
    </>
  );
}
