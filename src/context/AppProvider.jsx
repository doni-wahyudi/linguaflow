import React from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';

/**
 * AppProvider — Root-level context provider composition.
 *
 * Wraps children with:
 * 1. AuthProvider (Supabase authentication & cloud session)
 * 2. UserProvider (global state: user, progress, streak, XP, cloud sync)
 */
export const AppProvider = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default AppProvider;

