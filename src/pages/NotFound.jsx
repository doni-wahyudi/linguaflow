/**
 * @file NotFound.jsx
 * @description 404 page for unmatched routes.
 *
 * Kit note: `bg-white`, `rounded-2xl`, `text-xs/[3xl/sm]` and a hand-rolled pill
 * link are all replaced with `Card`, `Badge` and `ButtonLink`, so this page cannot
 * drift from the rest of the app. The badge is `brand` (brand-700 on brand-50,
 * 5.21:1) rather than the previous brand-600 on brand-50, which measured 3.58:1 and
 * failed at 12px.
 */

import React from 'react';
import { ArrowLeft, Compass } from 'lucide-react';
import { Badge, ButtonLink, Card } from '../components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <Card padding="lg" className="max-w-md w-full text-center shadow-soft-xl">
        <div
          aria-hidden="true"
          className="w-16 h-16 rounded-card bg-brand-50 border border-brand-200 text-brand-700 mx-auto flex items-center justify-center mb-4"
        >
          <Compass className="w-8 h-8 animate-pulse-soft" />
        </div>

        <Badge variant="brand" size="md" uppercase className="mb-3">
          404 Error
        </Badge>

        <h1 className="font-display font-bold text-display-sm text-ink-900 mb-2">
          Page not found
        </h1>
        <p className="text-body-md text-ink-500 mb-6 leading-relaxed">
          Looks like this destination hasn&apos;t been mapped on your language
          learning roadmap yet.
        </p>

        <ButtonLink to="/" size="lg" shape="pill" icon={ArrowLeft}>
          Go back home
        </ButtonLink>
      </Card>
    </div>
  );
}

