import { useState } from 'react';
import { api, formatDate, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';

const EMPTY = { name: '', rating: '', review: '' };

function Stars({ rating }) {
  return (
    <span className="review__stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function Reviews() {
  const { data, error, loading, reload } = useApi(() => api.reviews(), []);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: 'idle', message: '' });

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setErrors({});
    setState({ status: 'loading', message: '' });
    try {
      const response = await api.addReview({ ...form, rating: Number(form.rating) });
      setForm(EMPTY);
      setState({ status: 'done', message: response.message });
      reload();
    } catch (err) {
      setErrors(err.fields || {});
      setState({ status: 'error', message: err.message });
    }
  }

  const fieldError = (key) => errors[key] && <span className="field__error">{errors[key]}</span>;

  return (
    <>
      <PageHeader
        title="Reviews"
        trail={[{ label: 'Reviews' }]}
        lead="Hear from people who have worked with ThesisPulse, and share your own experience."
      />
      <section className="section">
        <div className="container reviews-layout">
          <div>
            <div className="section-head">
              <span className="eyebrow">Community feedback</span>
              <h2>Reviews from our users</h2>
            </div>
            {loading && <Loading label="Loading reviews..." />}
            {error && <ErrorBox error={error} onRetry={reload} />}
            {data && data.length === 0 && (
              <div className="reviews-empty">
                <h3>Be the first to leave a review</h3>
                <p>Your feedback helps others know what to expect.</p>
              </div>
            )}
            {data && data.length > 0 && (
              <div className="reviews-list">
                {data.map((item) => (
                  <article className="review" key={item.id}>
                    <div className="review__top">
                      <div>
                        <h3>{item.name}</h3>
                        <time className="muted small" dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                      </div>
                      <Stars rating={item.rating} />
                    </div>
                    <p className="review__text">{item.review}</p>
                  </article>
                ))}
              </div>
            )}
          </div>

          <form className="form review-form" onSubmit={submit}>
            <span className="eyebrow">Your experience</span>
            <h2>Write a review</h2>
            <label className="field">
              <span>Your name *</span>
              <input value={form.name} onChange={set('name')} maxLength={100} autoComplete="name" required />
              {fieldError('name')}
            </label>
            <label className="field">
              <span>Your rating *</span>
              <select value={form.rating} onChange={set('rating')} required>
                <option value="">Choose a rating</option>
                <option value="5">5 — Excellent</option>
                <option value="4">4 — Very good</option>
                <option value="3">3 — Good</option>
                <option value="2">2 — Fair</option>
                <option value="1">1 — Poor</option>
              </select>
              {fieldError('rating')}
            </label>
            <label className="field">
              <span>Your review *</span>
              <textarea
                rows="5"
                value={form.review}
                onChange={set('review')}
                maxLength={2000}
                placeholder="Tell us about your experience..."
                required
              />
              {fieldError('review')}
            </label>
            {state.status === 'done' && <p className="form-note form-note--success" role="status">{state.message}</p>}
            {state.status === 'error' && <p className="form-note form-note--error" role="alert">{state.message}</p>}
            <button className="btn btn--coral btn--lg" disabled={state.status === 'loading'}>
              {state.status === 'loading' ? 'Submitting...' : 'Submit review'}
            </button>
            <p className="muted small">Your review will be visible to everyone after submission.</p>
          </form>
        </div>
      </section>
    </>
  );
}
