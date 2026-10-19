import { api, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';

export default function Formats() {
  const { data, error, loading, reload } = useApi(() => api.resources(), []);

  return (
    <>
      <PageHeader
        title="Formats and templates"
        trail={[{ label: 'Formats' }]}
        lead="Free outlines to get you started. Always confirm the exact format prescribed by your university before you submit."
      />
      <section className="section">
        <div className="container container--narrow">
          {loading && <Loading />}
          {error && <ErrorBox error={error} onRetry={reload} />}
          <div className="grid">
            {(data || []).map((r) => (
              <article className="resource" key={r.id}>
                <span className="resource__type">{r.fileType}</span>
                <div>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </div>
                <a className="btn btn--ink" href={r.url} download>Download</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
