/**
 * @file Chip.jsx
 * @description Compact filter toggle — the level, category and topic selectors that
 * sit in a wrapping row.
 *
 * Design notes:
 * - A chip is a control, not a label. `Badge` is for status that the user reads;
 *   this is for a choice the user makes, so it is a real `<button>` with
 *   `aria-pressed` rather than a styled `<span>`.
 * - Selected and unselected are two complete class strings. Two `bg-*` utilities in
 *   one attribute resolve by stylesheet position rather than intent, which is why
 *   the old filter pills sometimes rendered with no fill at all.
 * - The unselected border is `brand-600` on hover, not `brand-300`: brand-300
 *   against white measures 1.81:1, so the hover state was visually absent.
 * - Both states keep a border so the chip does not change size when selected.
 *
 * @example
 * <div role="group" aria-label="Filter by level">
 *   {levels.map((l) => (
 *     <Chip key={l} selected={l === active} onClick={() => setActive(l)}>{l}</Chip>
 *   ))}
 * </div>
 */

import React from 'react';
import { Check } from 'lucide-react';

const sizeClasses = {
  sm: 'h-8 px-3 text-caption gap-1',
  md: 'h-9 px-3.5 text-body-sm gap-1.5',
};

const toneClasses = {
  /* Unselected on the cream page: a white chip with a hairline. */
  page: 'bg-surface-card text-ink-700 border-ink-200 hover:border-brand-600 hover:text-brand-800',
  /* Unselected inside a white card: it needs a fill, not another white surface. */
  card: 'bg-ink-100 text-ink-700 border-ink-200 hover:bg-ink-200 hover:text-ink-900',
};

const SELECTED = 'bg-brand-700 text-white border-brand-700 shadow-soft-sm';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} [props.selected=false]
 * @param {(e: React.MouseEvent) => void} [props.onClick]
 * @param {'sm'|'md'} [props.size='md']
 * @param {'page'|'card'} [props.tone='page'] - Surface the chip sits on.
 * @param {import('lucide-react').LucideIcon} [props.icon] - Leading icon; `Check` is
 *   used automatically when selected and no icon is given.
 * @param {boolean} [props.showCheck=true] - Add a tick when selected so the state is
 *   not signalled by colour alone (WCAG 1.4.1).
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export default function Chip({
  children,
  selected = false,
  onClick,
  size = 'md',
  tone = 'page',
  icon: Icon,
  showCheck = true,
  disabled = false,
  className = '',
}) {
  const Leading = Icon || (selected && showCheck ? Check : null);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={[
        'inline-flex items-center justify-center rounded-pill border font-body font-semibold whitespace-nowrap select-none',
        'transition-colors duration-200',
        sizeClasses[size] || sizeClasses.md,
        selected ? SELECTED : toneClasses[tone] || toneClasses.page,
        disabled ? 'opacity-50 cursor-not-allowed' : 'disabled:opacity-50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Leading && <Leading size={size === 'sm' ? 12 : 14} aria-hidden="true" />}
      {children}
    </button>
  );
}
