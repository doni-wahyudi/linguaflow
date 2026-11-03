/**
 * @file NotFound.jsx
 * @description 404 page for unmatched routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-card p-8 border border-ink-200/60 shadow-soft-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 mx-auto flex items-center justify-center mb-4">
          <Compass className="w-8 h-8 animate-pulse-soft" />
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-pill inline-block mb-2">
          404 Error
        </span>

        <h1 className="font-display font-bold text-3xl text-ink-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-ink-500 mb-6 leading-relaxed">
          Looks like this destination hasn't been mapped on your language learning roadmap yet.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-6 py-3 rounded-pill shadow-soft-sm transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Safety
        </Link>
      </div>
    </div>
  );
}

