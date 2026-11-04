/**
 * @file Logo.jsx
 * @description The single LinguaFlow brand mark.
 *
 * Previously the marketing page used a gradient Globe tile while the app navbar
 * used a 🌿 emoji, so the product had two different logos. Both now render this
 * component. The emoji is also unusable as a mark: it renders differently on
 * every OS, cannot be recoloured, and is announced inconsistently by screen
 * readers.
 *
 * @example
 * <Logo />                 {/* mark + wordmark *\/}
 * <Logo variant="mark" />  {/* tile only *\/}
 */

import React from 'react';
import { Globe } from 'lucide-react';

const tileSizes = {
  sm: 'w-7 h-7 rounded-button-sm',
  md: 'w-9 h-9 rounded-button',
  lg: 'w-11 h-11 rounded-button',
};

const glyphSizes = {
  sm: 14,
  md: 20,
  lg: 24,
};

/* Wordmark sizes come from the type scale (spec §3.2), not raw utilities, so the
   mark cannot drift a half-step from the headings next to it. */
const wordSizes = {
  sm: 'text-body-lg',
  md: 'text-display-xs',
  lg: 'text-display-sm',
};

/**
 * @param {object} props
 * @param {'full'|'mark'} [props.variant='full'] - Include the wordmark or just the tile.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Preset scale.
 * @param {string} [props.className='']
 */
export default function Logo({ variant = 'full', size = 'md', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <span
        aria-hidden="true"
        className={`${tileSizes[size]} grid place-items-center bg-gradient-to-br from-brand-500 to-brand-600 shadow-soft-sm`}
      >
        <Globe className="text-white" size={glyphSizes[size]} strokeWidth={2.2} />
      </span>

      {variant === 'full' && (
        <span
          className={`font-display font-bold tracking-tight text-ink-900 ${wordSizes[size]}`}
        >
          Lingua<span className="text-brand-600">Flow</span>
        </span>
      )}
    </span>
  );
}

Logo.displayName = 'Logo';
