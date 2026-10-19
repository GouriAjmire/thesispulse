import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, useApi } from '../api.js';
import { PageHeader } from '../components/Ui.jsx';
import { site } from '../siteConfig.js';

const EMPTY = {
  name: '', email: '', phone: '+91 ', specialty: '', university: '',
  serviceCode: '', deadline: '', message: '',
};

export default function Contact() {
  const [params] = useSearchParams();
  const services = useApi(() => api.services(), []);
  const specialties = useApi(() => api.specialties(), []);

  const [form, setForm] = useState({ ...EMPTY, serviceCode: params.get('service') || '' });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ status: 'idle', message: '' });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setErrors({});
    const phone = form.phone.replace(/[()\s-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setErrors({ phone: 'Enter a valid phone number including its country code, such as +91 9876543210.' });
      return;
    }
    setState({ status: 'loading', message: '' });
    const payload = { ...form, phone, deadline: form.deadline || null };
    try {
      const res = await api.enquire(payload);
      setState({ status: 'done', message: res.message });
      setForm(EMPTY);
    } catch (err) {
      setErrors(err.fields || {});
      setState({ status: 'error', message: err.message });
    }
  }

  const err = (k) => errors[k] && <span className="field__error">{errors[k]}</span>;

  return (
    <>
      <PageHeader
        title="Get your free quote"
        trail={[{ label: 'Contact' }]}
        lead="Tell us where you are in your thesis. We reply within 24 hours."
      />
      <section className="section">
        <div className="container contact-layout">
          {state.status === 'done' ? (
            <div className="success" role="status">
              <h2>Enquiry received</h2>
              <p>{state.message}</p>
              <button className="btn btn--ink" onClick={() => setState({ status: 'idle', message: '' })}>
                Send another enquiry
              </button>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="form__row">
                <label className="field">
                  <span>Full name *</span>
                  <input value={form.name} onChange={set('name')} autoComplete="name" required />
                  {err('name')}
                </label>
                <label className="field">
                  <span>Email *</span>
                  <input type="email" value={form.email} onChange={set('email')} autoComplete="email" required />
                  {err('email')}
                </label>
              </div>
              <div className="form__row">
                <label className="field">
                  <span>Phone / WhatsApp *</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={24}
                    placeholder="+91 98765 43210"
                    required
                  />
                  {err('phone')}
                </label>
                <label className="field">
                  <span>University</span>
                  <input value={form.university} onChange={set('university')} placeholder="e.g. MUHS, RGUHS, NTRUHS" />
                  {err('university')}
                </label>
              </div>
              <div className="form__row">
                <label className="field">
                  <span>Specialty</span>
                  <select value={form.specialty} onChange={set('specialty')}>
                    <option value="">Select specialty</option>
                    {(specialties.data || []).map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="field">
                  <span>Service needed</span>
                  <select value={form.serviceCode} onChange={set('serviceCode')}>
                    <option value="">Not sure yet</option>
                    {(services.data || []).map((s) => (
                      <option key={s.code} value={s.code}>{s.title}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Submission deadline</span>
                <input type="date" value={form.deadline} onChange={set('deadline')} />
              </label>
              <label className="field">
                <span>Anything else we should know?</span>
                <textarea rows="5" value={form.message} onChange={set('message')} maxLength={4000}
                  placeholder="Where are you stuck? What has your guide asked for?" />
                {err('message')}
              </label>
              {state.status === 'error' && <p className="form-note form-note--error" role="alert">{state.message}</p>}
              <button className="btn btn--coral btn--lg" disabled={state.status === 'loading'}>
                {state.status === 'loading' ? 'Sending...' : 'Send enquiry'}
              </button>
              <p className="muted small">Your details are confidential and never shared.</p>
            </form>
          )}

          <aside className="contact-card">
            <h3>Prefer to talk?</h3>
            <ul>
              <li><b>WhatsApp</b><a href={site.whatsapp} target="_blank" rel="noreferrer">Message us</a></li>
              <li><b>Hours</b><span>{site.hours}</span></li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
