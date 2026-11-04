/**
 * @file index.js
 * @description Barrel for the LinguaFlow UI kit — the only sanctioned way to draw
 * buttons, cards, badges, fields, dialogs and progress. Pages that need a shape
 * not represented here should extend a component rather than re-declare classes;
 * the previous build's drift (seven "success" greens, three card radii) came from
 * exactly that.
 */

export { default as Button, buttonClasses, ButtonLink } from './Button';
export { default as Card } from './Card';
export { default as Badge } from './Badge';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as ProgressBar, ProgressRing } from './ProgressBar';
export { default as SegmentedControl, segmentIds } from './SegmentedControl';
export { default as Chip } from './Chip';
export { default as AudioControls } from './AudioControls';
