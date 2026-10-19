import { Link } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';
import ServiceCard from '../components/ServiceCard.jsx';

export default function Services() {
  const { data, error, loading, reload } = useApi(() => api.services(), []);

  return (
    <>
      <PageHeader
        title="Our services"
        trail={[{ label: 'Services' }]}
        lead="Pick exactly what you need, or go end to end. Not sure which? Tell us where you are stuck and we will advise for free."
      />
      <section className="section">
        <div className="container">
          {loading && <Loading />}
          {error && <ErrorBox error={error} onRetry={reload} />}
          {data && (
            <div className="grid grid--3">
              {data.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          )}
          <div className="callout">
            <p>Not sure which package you need?</p>
            <Link to="/contact" className="btn btn--ink">Ask us, it is free</Link>
          </div>
        </div>
      </section>
    </>
  );
}
