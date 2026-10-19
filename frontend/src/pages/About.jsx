import { Link } from 'react-router-dom';
import { PageHeader, SectionHead } from '../components/Ui.jsx';

const VALUES = [
  { t: 'You stay the researcher', d: 'We mentor, edit and analyse alongside you. You collect the data and own the work, and you should be able to defend every page.' },
  { t: 'Honest timelines', d: 'If a deadline is not realistic we say so early and suggest what can be done instead.' },
  { t: 'Empathy first', d: 'We know the night calls, the unavailable guide and the blank protocol. Support should feel like a helpful senior, not a vendor.' },
  { t: 'Evidence over shortcuts', d: 'Clear methods, justified sample sizes and cited sources, so your work survives the viva and the journal reviewer.' },
];

export default function About() {
  return (
    <>
      <PageHeader title="About ThesisPulse" trail={[{ label: 'About' }]} />
      <section className="section">
        <div className="container container--narrow prose">
          <SectionHead eyebrow="Who we are" title="Mentors who have worn your shoes" />
          <p>
            Writing a thesis during residency is hard in a very specific way. Duties run long, guides are stretched and
            nobody teaches you how to build a protocol that an ethics committee will accept the first time.
          </p>
          <p>
            ThesisPulse exists to close that gap. We combine clinical understanding with research methods,
            biostatistics and scientific writing, and we apply them to your question, your patients and your
            university's format.
          </p>
          <p>
            Our job is to give you momentum: a feasible topic, a sound protocol, analysis you can explain and a
            manuscript you are proud to submit.
          </p>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container">
          <SectionHead eyebrow="How we work" title="Four principles" center />
          <div className="grid grid--4">
            {VALUES.map((v) => (
              <div className="tile" key={v.t}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
          <div className="callout">
            <p>Want to see how we would approach your project?</p>
            <Link to="/contact" className="btn btn--coral">Get a free quote</Link>
          </div>
        </div>
      </section>
    </>
  );
}
