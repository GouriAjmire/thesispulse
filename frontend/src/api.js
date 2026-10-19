import { useEffect, useState } from 'react';

const BASE = import.meta.env.VITE_API_URL || '';
const AUTH_KEY = 'tp_admin_auth';

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export const adminAuth = {
  get: () => {
    try { return sessionStorage.getItem(AUTH_KEY); } catch { return null; }
  },
  set: (user, pass) => {
    try { sessionStorage.setItem(AUTH_KEY, btoa(`${user}:${pass}`)); } catch { /* ignore */ }
  },
  clear: () => {
    try { sessionStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
  },
};

async function request(path, { method = 'GET', body, admin = false, authOverride } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (admin) {
    const token = authOverride || adminAuth.get();
    if (token) headers.Authorization = `Basic ${token}`;
  }
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the server. Please try again in a moment.', 0);
  }
  if (res.status === 204) return null;
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    throw new ApiError((data && data.message) || `Request failed (${res.status})`, res.status, data && data.fields);
  }
  return data;
}

const qs = (params) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') sp.set(k, v);
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
};

export const api = {
  services: () => request('/api/services'),
  faqs: () => request('/api/faqs'),
  reviews: () => request('/api/reviews'),
  addReview: (body) => request('/api/reviews', { method: 'POST', body }),
  specialties: () => request('/api/specialties'),
  resources: () => request('/api/resources'),
  categories: () => request('/api/categories'),
  posts: (params) => request(`/api/posts${qs(params)}`),
  recentPosts: (limit = 3) => request(`/api/posts/recent?limit=${limit}`),
  archives: () => request('/api/posts/archives'),
  post: (slug) => request(`/api/posts/${encodeURIComponent(slug)}`),
  enquire: (body) => request('/api/enquiries', { method: 'POST', body }),
  subscribe: (email) => request('/api/subscribers', { method: 'POST', body: { email } }),

  admin: {
    check: (token) => request('/api/admin/me', { admin: true, authOverride: token }),
    stats: () => request('/api/admin/stats', { admin: true }),
    posts: () => request('/api/admin/posts', { admin: true }),
    createPost: (body) => request('/api/admin/posts', { method: 'POST', body, admin: true }),
    updatePost: (id, body) => request(`/api/admin/posts/${id}`, { method: 'PUT', body, admin: true }),
    deletePost: (id) => request(`/api/admin/posts/${id}`, { method: 'DELETE', admin: true }),
    enquiries: () => request('/api/admin/enquiries', { admin: true }),
    setEnquiryStatus: (id, status) =>
      request(`/api/admin/enquiries/${id}/status`, { method: 'PATCH', body: { status }, admin: true }),
    subscribers: () => request('/api/admin/subscribers', { admin: true }),
  },
};

/** Tiny data-fetching hook: { data, error, loading, reload }. */
export function useApi(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
