import React from 'react';
import { UserProvider } from './UserContext';

/**
 * AppProvider — Root-level context provider composition.
 *
 * Wraps children with UserProvider (and any additional context providers
 * that may be added as the application expands).
 */
export const AppProvider = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default AppProvider;

