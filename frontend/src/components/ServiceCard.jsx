import { Link } from 'react-router-dom';

export default function ServiceCard({ service, showFeatures = true }) {
  return (
    <article className={`service ${service.highlight ? 'service--hot' : ''}`}>
      {service.badge && <span className="service__badge">{service.badge}</span>}
      <span className="service__num">{service.number}</span>
      <h3>{service.title}</h3>
      <p>{service.summary}</p>
      {showFeatures && (
        <ul className="ticks">
          {service.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      <Link to={`/contact?service=${service.code}`} className={`btn ${service.highlight ? 'btn--coral' : 'btn--ghost'}`}>
        Enquire about this
      </Link>
    </article>
  );
}
