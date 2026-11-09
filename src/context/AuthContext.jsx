import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (isMounted) {
        if (!error && initialSession) {
          setSession(initialSession);
          setUser(initialSession.user ?? null);
        }
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Cloud auth is not configured. Continuing in guest mode.') };
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.session) {
      setSession(data.session);
      setUser(data.user);
    }
    setLoading(false);
    return { data, error };
  }, []);

  const signUp = useCallback(async (email, password, name = '') => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Cloud auth is not configured. Continuing in guest mode.') };
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (!error && data?.session) {
      setSession(data.session);
      setUser(data.user);
    }
    setLoading(false);
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(null);
      setSession(null);
      return { error: null };
    }
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
    return { error };
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured || !supabase) {
      return { data: null, error: new Error('Cloud auth is not configured. Continuing in guest mode.') };
    }
    return await supabase.auth.resetPasswordForEmail(email);
  }, []);

  const value = {
    user,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
