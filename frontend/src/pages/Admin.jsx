import { useEffect, useState } from 'react';
import { adminAuth, api, formatDate, useApi } from '../api.js';
import { ErrorBox, Loading, PageHeader } from '../components/Ui.jsx';

const STATUSES = ['NEW', 'CONTACTED', 'CONFIRMED', 'CLOSED'];

export default function Admin() {
  const [authed, setAuthed] = useState(Boolean(adminAuth.get()));

  function logout() {
    adminAuth.clear();
    setAuthed(false);
  }

  return (
    <>
      <PageHeader title="Team dashboard" trail={[{ label: 'Admin' }]} />
      <section className="section">
        <div className="container">
          {authed ? <Dashboard onLogout={logout} onExpired={logout} /> : <Login onDone={() => setAuthed(true)} />}
        </div>
      </section>
    </>
  );
}

function Login({ onDone }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const token = btoa(`${user}:${pass}`);
    try {
      await api.admin.check(token);
      adminAuth.set(user, pass);
      onDone();
    } catch (err) {
      setError(err.status === 401 ? 'Wrong username or password.' : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form form--narrow" onSubmit={submit}>
      <label className="field">
        <span>Username</span>
        <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" required />
      </label>
      {error && <p className="form-note form-note--error" role="alert">{error}</p>}
      <button className="btn btn--ink" disabled={busy}>{busy ? 'Checking...' : 'Sign in'}</button>
    </form>
  );
}

function Dashboard({ onLogout, onExpired }) {
  const [tab, setTab] = useState('enquiries');
  const stats = useGuarded(() => api.admin.stats(), onExpired, [tab]);

  return (
    <div className="admin">
      <div className="admin__bar">
        <div className="admin__stats">
          <div><b>{stats.data?.newEnquiries ?? '-'}</b><span>new enquiries</span></div>
          <div><b>{stats.data?.enquiries ?? '-'}</b><span>total enquiries</span></div>
          <div><b>{stats.data?.posts ?? '-'}</b><span>posts</span></div>
          <div><b>{stats.data?.subscribers ?? '-'}</b><span>subscribers</span></div>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={onLogout}>Sign out</button>
      </div>

      <div className="tabs" role="tablist">
        {['enquiries', 'posts', 'subscribers'].map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === 'enquiries' && <Enquiries onExpired={onExpired} />}
      {tab === 'posts' && <Posts onExpired={onExpired} />}
      {tab === 'subscribers' && <Subscribers onExpired={onExpired} />}
    </div>
  );
}

/** Like useApi, but signs the user out if the server says the credentials are no longer valid. */
function useGuarded(fn, onExpired, deps) {
  const res = useApi(fn, deps);
  const expired = res.error?.status === 401;
  useEffect(() => {
    if (expired) onExpired();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);
  return res;
}

function Enquiries({ onExpired }) {
  const { data, error, loading, reload } = useGuarded(() => api.admin.enquiries(), onExpired, []);
  const [rowError, setRowError] = useState('');

  async function setStatus(id, status) {
    setRowError('');
    try {
      await api.admin.setEnquiryStatus(id, status);
      reload();
    } catch (err) {
      setRowError(err.message);
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (!data.length) return <p className="state">No enquiries yet.</p>;

  return (
    <>
      {rowError && <p className="form-note form-note--error">{rowError}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Received</th><th>Who</th><th>Details</th><th>Status</th></tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e.id}>
                <td>{formatDate(e.createdAt)}</td>
                <td>
                  <b>{e.name}</b><br />
                  <a href={`mailto:${e.email}`}>{e.email}</a>
                  {e.phone && <><br />{e.phone}</>}
                </td>
                <td>
                  {[e.specialty, e.university, e.serviceCode].filter(Boolean).join(' | ') || '-'}
                  {e.deadline && <><br /><small>Deadline: {formatDate(e.deadline)}</small></>}
                  {e.message && <p className="table__msg">{e.message}</p>}
                </td>
                <td>
                  <select value={e.status} onChange={(ev) => setStatus(e.id, ev.target.value)} aria-label={`Status for ${e.name}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Subscribers({ onExpired }) {
  const { data, error, loading, reload } = useGuarded(() => api.admin.subscribers(), onExpired, []);
  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;
  if (!data.length) return <p className="state">No subscribers yet.</p>;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Email</th><th>Subscribed</th></tr></thead>
        <tbody>
          {data.map((s) => (
            <tr key={s.id}><td>{s.email}</td><td>{formatDate(s.subscribedAt)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const BLANK_POST = { id: null, title: '', excerpt: '', content: '', categoryId: '', author: '', published: true };

function Posts({ onExpired }) {
  const { data, error, loading, reload } = useGuarded(() => api.admin.posts(), onExpired, []);
  const cats = useApi(() => api.categories(), []);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  async function remove(p) {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await api.admin.deletePost(p.id);
      reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (editing) {
    return (
      <PostForm
        initial={editing}
        categories={cats.data || []}
        onCancel={() => setEditing(null)}
        onSaved={() => { setEditing(null); reload(); }}
      />
    );
  }

  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} onRetry={reload} />;

  return (
    <>
      <div className="admin__actions">
        <button className="btn btn--coral btn--sm" onClick={() => setEditing({ ...BLANK_POST, categoryId: cats.data?.[0]?.id ?? '' })}>
          New post
        </button>
        {msg && <span className="form-note form-note--error">{msg}</span>}
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>State</th><th /></tr></thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td><b>{p.title}</b></td>
                <td>{p.categoryName}</td>
                <td>{formatDate(p.publishedOn)}</td>
                <td>{p.published ? 'Published' : 'Draft'}</td>
                <td className="table__actions">
                  <button className="btn btn--ghost btn--sm" onClick={() => setEditing(p)}>Edit</button>
                  <button className="btn btn--ghost btn--sm" onClick={() => remove(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PostForm({ initial, categories, onCancel, onSaved }) {
  const [form, setForm] = useState({ ...initial, categoryId: initial.categoryId || '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    const body = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      categoryId: Number(form.categoryId),
      author: form.author || null,
      published: form.published,
    };
    try {
      if (form.id) await api.admin.updatePost(form.id, body);
      else await api.admin.createPost(body);
      onSaved();
    } catch (err) {
      setErrors(err.fields || {});
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  const err = (k) => errors[k] && <span className="field__error">{errors[k]}</span>;

  return (
    <form className="form" onSubmit={submit}>
      <label className="field">
        <span>Title</span>
        <input value={form.title} onChange={set('title')} required />
        {err('title')}
      </label>
      <div className="form__row">
        <label className="field">
          <span>Category</span>
          <select value={form.categoryId} onChange={set('categoryId')} required>
            <option value="" disabled>Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Author (optional)</span>
          <input value={form.author || ''} onChange={set('author')} />
        </label>
      </div>
      <label className="field">
        <span>Excerpt</span>
        <textarea rows="2" value={form.excerpt} onChange={set('excerpt')} required />
        {err('excerpt')}
      </label>
      <label className="field">
        <span>Content (Markdown supported)</span>
        <textarea rows="14" value={form.content} onChange={set('content')} required />
        {err('content')}
      </label>
      <label className="check">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
        Published
      </label>
      {message && <p className="form-note form-note--error" role="alert">{message}</p>}
      <div className="admin__actions">
        <button className="btn btn--ink" disabled={busy}>{busy ? 'Saving...' : 'Save post'}</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
