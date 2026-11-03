import { AppProvider } from './context/AppProvider';
import AppRouter from './Router';

/**
 * App — Root component
 *
 * Wraps the entire application with:
 * 1. AppProvider (global state: user, progress, streak, XP)
 * 2. AppRouter (React Router with all page routes)
 */
export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}

