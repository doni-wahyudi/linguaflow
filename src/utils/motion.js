/**
 * @module motion
 * @description The single source of truth for JS animation curves (spec §6.3).
 *
 * Why this exists: `cubic-bezier(0.16, 1, 0.3, 1)` was copied by hand into
 * fifteen components, and three reveal animations quietly used Framer Motion's
 * default spring instead. A curve that lives in one place cannot drift; one that
 * lives in fifteen does.
 *
 * Durations are deliberately left as literals at the call site. A differing
 * duration reads as hierarchy (a press is quicker than a page turn); a differing
 * curve just reads as sloppy.
 *
 * Reduced motion is NOT handled here. `<MotionConfig reducedMotion="user">` in
 * App.jsx neutralises transform/layout animations app-wide (spec §6.5); this
 * module only says what the curve is when motion is allowed.
 *
 * @example
 * import { transitionEase } from '../../utils/motion';
 *
 * transition={{ duration: 0.2, ease: transitionEase }}
 */

/**
 * The app-wide enter curve: fast out, long settle, no overshoot.
 * Equal to `cubic-bezier(0.16, 1, 0.3, 1)`.
 */
export const transitionEase = [0.16, 1, 0.3, 1];

/**
 * Named springs, for the few places where a physical bounce carries meaning.
 * `pop` is the active-tab indicator; `glide` is a card that steps in.
 */
export const spring = {
  pop: { type: 'spring', stiffness: 400, damping: 20 },
  glide: { type: 'spring', stiffness: 200, damping: 15 },
};

/**
 * The "wrong answer" shake: one oversized pair of swings, then a smaller one,
 * settling at zero. Used by every exercise type so a wrong answer always feels
 * the same, and is paired with colour + text because motion alone is not an
 * accessible channel (WCAG 1.4.1).
 */
export const shakeX = [0, -6, 6, -4, 4, 0];
