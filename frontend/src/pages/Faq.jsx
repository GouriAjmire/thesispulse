import { Link } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';
import Accordion from '../components/Accordion.jsx';

export default function Faq() {
  const { data, error, loading, reload } = useApi(() => api.faqs(), []);
  return (
    <>
      <PageHeader title="Frequently asked questions" trail={[{ label: 'FAQs' }]} />
      <section className="section">
        <div className="container container--narrow">
          {loading && <Loading />}
          {error && <ErrorBox error={error} onRetry={reload} />}
          {data && <Accordion items={data} />}
          <div className="callout">
            <p>Still have a question?</p>
            <Link to="/contact" className="btn btn--ink">Ask us directly</Link>
          </div>
        </div>
      </section>
    </>
  );
}
