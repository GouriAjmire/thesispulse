import { useState } from 'react';
import { api } from '../api.js';

export default function Newsletter({ variant = 'card' }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function submit(e) {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const res = await api.subscribe(email);
      setState({ status: 'done', message: res.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', message: err.fields?.email || err.message });
    }
  }

  return (
    <div className={`newsletter newsletter--${variant}`}>
      <div className="newsletter__copy">
        <h3>Get the weekly Pulse</h3>
        <p>One short guide a week on topics, statistics, IEC approvals and publishing. No spam.</p>
      </div>
      <form onSubmit={submit} className="newsletter__form" noValidate>
        <label className="sr-only" htmlFor={`nl-${variant}`}>Email address</label>
        <input
          id={`nl-${variant}`}
          type="email"
          placeholder="you@hospital.in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn--coral" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? 'Joining...' : 'Subscribe'}
        </button>
        {state.message && (
          <p className={`form-note ${state.status === 'error' ? 'form-note--error' : 'form-note--ok'}`} role="status">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
