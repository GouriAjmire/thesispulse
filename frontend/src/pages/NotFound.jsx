import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container state">
        <h1>Flatline: page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn--ink">Back to home</Link>
      </div>
    </section>
  );
}
