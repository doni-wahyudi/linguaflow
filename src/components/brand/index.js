/**
 * @file index.js
 * @description Barrel for brand assets: the one place LinguaFlow's logo, flags
 * and semantic iconography are defined.
 */

export { default as Logo } from './Logo';
export { default as Flag, flagCodes } from './Flag';
export { default as SemanticIcon, ICONS, resolveIcon } from './icons';
