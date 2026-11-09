/**
 * @file supabaseClient.js
 * @description Supabase client initialization with graceful offline fallback.
 * Zero external dependencies: provides GoTrue auth & PostgREST query interfaces.
 */

const metaEnv = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const procEnv = typeof process !== 'undefined' && process.env ? process.env : {};

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || procEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || procEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

/**
 * Native lightweight Supabase client conforming to @supabase/supabase-js API.
 */
export function createClient(url, anonKey, options = {}) {
  const cleanUrl = (url || '').replace(/\/+$/, '');
  const authKey = 'linguaflow_supabase_session';
  const listeners = new Set();

  const getStoredSession = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(authKey);
        return item ? JSON.parse(item) : null;
      }
    } catch {
      // Storage unavailable or disabled
    }
    return null;
  };

  const setStoredSession = (session) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (session) {
          window.localStorage.setItem(authKey, JSON.stringify(session));
        } else {
          window.localStorage.removeItem(authKey);
        }
      }
    } catch {
      // Storage unavailable or disabled
    }
  };

  let currentSession = getStoredSession();

  const notify = (event, session) => {
    for (const cb of listeners) {
      try {
        cb(event, session);
      } catch (err) {
        console.error('Error in auth state change listener:', err);
      }
    }
  };

  const auth = {
    async getSession() {
      currentSession = getStoredSession();
      return { data: { session: currentSession }, error: null };
    },
    async getUser() {
      currentSession = getStoredSession();
      return { data: { user: currentSession?.user || null }, error: null };
    },
    onAuthStateChange(callback) {
      listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              listeners.delete(callback);
            },
          },
        },
      };
    },
    async signUp({ email, password, options = {} }) {
      try {
        const res = await fetch(`${cleanUrl}/auth/v1/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: anonKey,
          },
          body: JSON.stringify({
            email,
            password,
            data: options.data || {},
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { data: { user: null, session: null }, error: new Error(data.msg || data.message || data.error_description || 'Signup failed') };
        }
        const session = data.access_token ? data : null;
        const user = data.user || (session ? session.user : data);
        if (session) {
          currentSession = session;
          setStoredSession(session);
          notify('SIGNED_IN', session);
        }
        return { data: { user, session }, error: null };
      } catch (err) {
        return { data: { user: null, session: null }, error: err };
      }
    },
    async signInWithPassword({ email, password }) {
      try {
        const res = await fetch(`${cleanUrl}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: anonKey,
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { data: { user: null, session: null }, error: new Error(data.error_description || data.msg || data.message || 'Invalid login credentials') };
        }
        currentSession = data;
        setStoredSession(data);
        notify('SIGNED_IN', data);
        return { data: { user: data.user, session: data }, error: null };
      } catch (err) {
        return { data: { user: null, session: null }, error: err };
      }
    },
    async signOut() {
      try {
        if (currentSession?.access_token) {
          await fetch(`${cleanUrl}/auth/v1/logout`, {
            method: 'POST',
            headers: {
              apikey: anonKey,
              Authorization: `Bearer ${currentSession.access_token}`,
            },
          }).catch(() => {});
        }
      } finally {
        currentSession = null;
        setStoredSession(null);
        notify('SIGNED_OUT', null);
      }
      return { error: null };
    },
    async resetPasswordForEmail(email) {
      try {
        const res = await fetch(`${cleanUrl}/auth/v1/recover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: anonKey,
          },
          body: JSON.stringify({ email }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { data: null, error: new Error(data.msg || data.message || 'Password recovery request failed') };
        }
        return { data, error: null };
      } catch (err) {
        return { data: null, error: err };
      }
    },
  };

  function from(table) {
    let method = 'GET';
    const queryParams = [];
    const headers = {
      apikey: anonKey,
      'Content-Type': 'application/json',
    };
    if (currentSession?.access_token) {
      headers['Authorization'] = `Bearer ${currentSession.access_token}`;
    }
    let body = undefined;

    const builder = {
      select(columns = '*') {
        queryParams.push(`select=${encodeURIComponent(columns)}`);
        return builder;
      },
      eq(column, value) {
        queryParams.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`);
        return builder;
      },
      single() {
        headers['Accept'] = 'application/vnd.pgrst.object+json';
        return builder;
      },
      insert(rows) {
        method = 'POST';
        headers['Prefer'] = 'return=representation';
        body = JSON.stringify(rows);
        return builder;
      },
      upsert(rows, options = {}) {
        method = 'POST';
        headers['Prefer'] = 'resolution=merge-duplicates,return=representation';
        body = JSON.stringify(rows);
        return builder;
      },
      update(values) {
        method = 'PATCH';
        headers['Prefer'] = 'return=representation';
        body = JSON.stringify(values);
        return builder;
      },
      delete() {
        method = 'DELETE';
        return builder;
      },
      async then(resolve, reject) {
        try {
          const qs = queryParams.length ? `?${queryParams.join('&')}` : '';
          const res = await fetch(`${cleanUrl}/rest/v1/${table}${qs}`, {
            method,
            headers,
            body,
          });
          const text = await res.text();
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            json = text;
          }
          if (!res.ok) {
            const err = new Error(json?.message || json?.error || `HTTP ${res.status}: Request failed`);
            resolve({ data: null, error: err });
            return;
          }
          resolve({ data: json, error: null });
        } catch (err) {
          resolve({ data: null, error: err });
        }
      },
    };

    return builder;
  }

  return {
    auth,
    from,
  };
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
