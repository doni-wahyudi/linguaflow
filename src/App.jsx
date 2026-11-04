import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { AppProvider } from './context/AppProvider';
import AppRouter from './Router';

/**
 * App — Root component
 *
 * Wraps the entire application with:
 * 1. AppProvider (global state: user, progress, streak, XP)
 * 2. MotionConfig (spec §6.5: reduced motion is honoured by JS animation too)
 * 3. AppRouter (React Router with all page routes)
 *
 * Why MotionConfig is mandatory rather than nice-to-have: `prefers-reduced-motion`
 * in CSS cannot reach Framer Motion. Every animation in this app is JS-driven, so
 * without the provider the media query in src/styles/index.css only neutralises the
 * CSS transitions and the page keeps moving for the users who asked it not to.
 *
 * The reveal fallback covers the other half of §6.5: sections that enter with
 * `whileInView` start at opacity 0, which means a print, PDF export, or crawler
 * that never scrolls receives a blank document. When motion is reduced, or when a
 * print starts, [data-reveal] nodes are forced visible by the CSS rule in
 * src/styles/index.css.
 */
export default function App() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    const apply = () => {
      if (reduceQuery?.matches) root.classList.add('lf-reveal-fallback');
    };

    apply();
    reduceQuery?.addEventListener?.('change', apply);

    /* Print/PDF: un-hide everything regardless of the motion preference. */
    const onBeforePrint = () => root.classList.add('lf-reveal-fallback');
    const onAfterPrint = () => {
      if (!reduceQuery?.matches) root.classList.remove('lf-reveal-fallback');
    };
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);

    return () => {
      reduceQuery?.removeEventListener?.('change', apply);
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        <AppRouter />
      </MotionConfig>
    </AppProvider>
  );
}
