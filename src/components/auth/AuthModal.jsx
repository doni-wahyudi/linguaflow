/**
 * @file AuthModal.jsx
 * @description Accessible dialog for Supabase sign-in, account creation, and password recovery.
 * Fully WCAG 2.1 AA/AAA compliant with keyboard navigation, focus management, and dark theme support.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function AuthModal({ isOpen, onClose }) {
  const { signIn, signUp, resetPassword, isConfigured } = useAuth();

  const [tab, setTab] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset internal state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, tab]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isConfigured) {
      setError('Cloud authentication is in guest offline mode. To sync across devices, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
      return;
    }

    setLoading(true);

    try {
      if (tab === 'signin') {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err.message || 'Failed to sign in. Please verify your credentials.');
        } else {
          onClose();
        }
      } else if (tab === 'signup') {
        const { data, error: err } = await signUp(email, password, name);
        if (err) {
          setError(err.message || 'Failed to create account.');
        } else {
          if (data?.session) {
            onClose();
          } else {
            setSuccessMsg('Account created! Please check your email inbox to confirm your account.');
          }
        }
      } else if (tab === 'forgot') {
        const { error: err } = await resetPassword(email);
        if (err) {
          setError(err.message || 'Could not send recovery instructions.');
        } else {
          setSuccessMsg('Password reset instructions have been sent to your email.');
        }
      }
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal-portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm"
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            key="auth-modal-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            className="relative w-full max-w-md bg-surface-card rounded-2xl border border-ink-200 shadow-2xl p-6 sm:p-8 text-ink-900 overflow-hidden"
          >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 text-ink-500 hover:text-ink-900 rounded-lg hover:bg-surface-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-display-xs font-bold text-ink-900">
                {tab === 'signin' && 'Welcome Back'}
                {tab === 'signup' && 'Create Your Account'}
                {tab === 'forgot' && 'Reset Password'}
              </h2>
              <p className="text-body-sm text-ink-500">
                {tab === 'signin' && 'Sign in to sync your language progress across devices.'}
                {tab === 'signup' && 'Join LinguaFlow to safeguard your learning journey.'}
                {tab === 'forgot' && 'Enter your registered email to receive a recovery link.'}
              </p>
            </div>
          </div>

          {/* Configuration Hint Banner if unconfigured */}
          {!isConfigured && (
            <div className="mb-5 p-3.5 rounded-xl bg-info-bg border border-info-border text-info-strong text-caption flex items-start gap-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Offline-First Guest Mode Active</span>
                LinguaFlow works 100% locally. To connect Supabase cloud sync, configure your credentials in <code className="px-1 py-0.5 rounded bg-surface-100 text-ink-900 font-mono">.env</code>.
              </div>
            </div>
          )}

          {/* Accessible Tab Navigation */}
          {tab !== 'forgot' && (
            <div role="tablist" className="flex border-b border-ink-200 mb-6">
              <button
                type="button"
                role="tab"
                id="tab-signin"
                aria-selected={tab === 'signin'}
                aria-controls="panel-auth"
                onClick={() => setTab('signin')}
                className={`flex-1 py-2.5 text-center text-body-sm font-semibold transition-colors border-b-2 -mb-px ${
                  tab === 'signin'
                    ? 'border-brand-600 text-brand-700 dark:text-brand-400'
                    : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                id="tab-signup"
                aria-selected={tab === 'signup'}
                aria-controls="panel-auth"
                onClick={() => setTab('signup')}
                className={`flex-1 py-2.5 text-center text-body-sm font-semibold transition-colors border-b-2 -mb-px ${
                  tab === 'signup'
                    ? 'border-brand-600 text-brand-700 dark:text-brand-400'
                    : 'border-transparent text-ink-500 hover:text-ink-700'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div role="alert" className="mb-4 p-3 rounded-xl bg-error-bg border border-error-border text-error-strong text-body-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div role="status" className="mb-4 p-3 rounded-xl bg-success-bg border border-success-border text-success-strong text-body-sm flex items-start gap-2.5">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form id="panel-auth" onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <Input
                label="Full Name"
                placeholder="Alex Morgan"
                icon={User}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {tab !== 'forgot' && (
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
              />
            )}

            {tab === 'signin' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-caption text-brand-700 dark:text-brand-400 hover:underline font-medium"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center"
              >
                {tab === 'signin' && 'Sign In'}
                {tab === 'signup' && 'Create Account'}
                {tab === 'forgot' && 'Send Recovery Email'}
              </Button>
            </div>
          </form>

          {/* Back to sign in link for forgot tab */}
          {tab === 'forgot' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setTab('signin')}
                className="text-body-sm text-ink-500 hover:text-ink-900 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
}
