/**
 * @file SegmentedControl.jsx
 * @description Two-to-many option switcher for choosing one view within a page —
 * the pill rail with a raised selected segment.
 *
 * Why this exists: the Writing Lab and the Practice hub each hand-rolled the same
 * rail (a `bg-ink-100 rounded-pill` wrapper, a `bg-white` selected chip, a
 * `text-ink-600` unselected one). `text-ink-600` is not a token, so the unselected
 * labels silently inherited black; `shadow-inner-sm` is likewise not a token, so
 * the inset shadow never rendered. Both copies also swapped panels with plain
 * buttons, which leaves the panel change unannounced.
 *
 * Semantics follow the ARIA tabs pattern: `role="tablist"` with one `role="tab"`
 * per option, `aria-selected`, `aria-controls`, roving `tabIndex`, and Left/Right
 * (plus Up/Down, Home and End) to move the selection. Because a tab selects a
 * panel it does not activate it, the panels stay in the DOM and are labelled by
 * the caller through `segmentIds(name)`.
 *
 * @example
 * const ids = segmentIds('writing');
 * <SegmentedControl
 *   name="writing"
 *   label="Writing practice mode"
 *   tabs={[{ id: 'curated', label: 'Character Decks', icon: Layers }]}
 *   value={mode}
 *   onChange={setMode}
 * />
 * <div role="tabpanel" id={ids.panelId('curated')} aria-labelledby={ids.tabId('curated')}>…</div>
 */

import React, { useRef } from 'react';

/** Stable id helpers so a page can wire its panels to its tabs. */
export const segmentIds = (name) => ({
  tabId: (value) => `${name}-tab-${value}`,
  panelId: (value) => `${name}-panel-${value}`,
});

const railClasses = {
  /** Default: the control sits directly on the cream page. */
  page: 'bg-ink-100 border-ink-200',
  /** For a rail sitting inside a white card, where ink-100 reads as a mistake. */
  card: 'bg-surface-100 border-ink-200',
};

const sizeClasses = {
  sm: { segment: 'h-8 px-3 text-caption gap-1', icon: 12 },
  md: { segment: 'h-10 px-4 text-body-sm gap-1.5', icon: 14 },
};

const SEGMENT_BASE =
  'inline-flex items-center justify-center rounded-pill font-semibold whitespace-nowrap transition-colors duration-200';
/* Selected is a white chip on the ink-100 rail (brand-700 label = 8.75:1);
   unselected is ink-700 on the rail itself, also 8.75:1 — the old build used the
   non-existent `text-ink-600` here. */
const SEGMENT_ON = 'bg-surface-card text-brand-700 shadow-soft-sm';
const SEGMENT_OFF = 'text-ink-700 hover:bg-ink-200 hover:text-ink-900';

/**
 * @param {object} props
 * @param {string} props.name - Namespace for the generated tab/panel ids.
 * @param {'sm'|'md'} [props.size='md']
 * @param {'page'|'card'} [props.tone='page'] - Rail surface.
 * @param {string} props.label - Accessible name for the group.
 * @param {Array<{id: string, label: React.ReactNode, icon?: import('lucide-react').LucideIcon}>} props.tabs
 *   `label` may carry a count (`Flashcards (12 due)`), so it accepts a node.
 * @param {string} props.value - Active tab id.
 * @param {(id: string) => void} props.onChange
 * @param {string} [props.className] - Extra rail classes (e.g. `w-full`).
 * @returns {JSX.Element}
 */
export default function SegmentedControl({
  name,
  size = 'md',
  tone = 'page',
  label,
  tabs,
  value,
  onChange,
  className = '',
}) {
  const ids = segmentIds(name);
  const tabRefs = useRef({});
  const metrics = sizeClasses[size] || sizeClasses.md;

  const select = (id) => {
    if (id !== value) onChange(id);
  };

  /* Roving focus: only the selected tab is in the tab order, and the arrow keys
     move both selection and focus. */
  const focusAt = (index) => {
    const next = tabs[(index + tabs.length) % tabs.length];
    if (!next) return;
    select(next.id);
    requestAnimationFrame(() => tabRefs.current[next.id]?.focus());
  };

  const handleKeyDown = (e) => {
    const current = tabs.findIndex((t) => t.id === value);
    if (current === -1) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        focusAt(current + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        focusAt(current - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusAt(tabs.length - 1);
        break;
      default:
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={[
        /* Wraps rather than overflowing: four labelled tabs do not fit a phone, and
           a horizontally scrolling tablist is easy to leave half unseen. */
        'inline-flex flex-wrap items-center gap-1 p-1 rounded-pill border font-body',
        railClasses[tone] || railClasses.page,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {tabs.map((tab) => {
        const isSelected = tab.id === value;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={ids.tabId(tab.id)}
            aria-selected={isSelected}
            /* Only the selected tab points at a panel: these pages mount one panel
               at a time, and an aria-controls that references a missing element is an
               invalid relation (axe `aria-valid-attr-value`). */
            aria-controls={isSelected ? ids.panelId(tab.id) : undefined}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => select(tab.id)}
            className={[
              SEGMENT_BASE,
              metrics.segment,
              isSelected ? SEGMENT_ON : SEGMENT_OFF,
            ].join(' ')}
          >
            {Icon && <Icon size={metrics.icon} aria-hidden="true" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
