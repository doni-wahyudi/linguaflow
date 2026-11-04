/**
 * @file Navbar.jsx
 * @description Top navigation bar for authenticated pages. Features the brand
 * logo, navigation links with active states, XP/streak readouts, profile avatar,
 * and a focus-managed mobile drawer.
 *
 * @example
 * <Navbar />
 */

import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Zap,
  Flame,
  User,
  LayoutDashboard,
  BookOpen,
  Repeat,
  PenTool,
  Award,
} from 'lucide-react';
import { Logo } from '../brand';
import { transitionEase } from '../../utils/motion';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lessons', label: 'Lessons', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Repeat },
  { to: '/exams', label: 'Official Exams', icon: Award },
  { to: '/writing', label: 'Writing Lab', icon: PenTool },
];

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: transitionEase },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

/**
 * Top navigation bar with responsive mobile menu.
 *
 * @param {object} props
 * @param {number} [props.xp=0] - User's current XP.
 * @param {number} [props.streak=0] - User's current streak.
 * @param {string} [props.avatarUrl] - User profile image URL.
 * @param {string} [props.userName] - User display name.
 * @returns {JSX.Element}
 */
const Navbar = ({ xp = 0, streak = 0, avatarUrl, userName = '' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef(null);
  const triggerRef = useRef(null);

  /** Close sidebar on Escape, lock scroll, and manage focus for the drawer */
  useEffect(() => {
    if (!mobileOpen) return;

    const FOCUSABLE =
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const handler = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        return;
      }
      // Tab trap: the page behind the overlay is still in the DOM, so without
      // this a keyboard user tabs out of the drawer into content they cannot
      // see or reach back from.
      if (e.key !== 'Tab' || !sidebarRef.current) return;
      const items = [...sidebarRef.current.querySelectorAll(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';

    // Move focus into the drawer so keyboard users are not left behind the
    // overlay; return it to the hamburger on close.
    const firstLink = sidebarRef.current?.querySelector('a, button');
    firstLink?.focus();

    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };
  }, [mobileOpen]);

  const linkClass = ({ isActive }) =>
    [
      'relative px-3 py-2 text-body-sm font-semibold rounded-button transition-colors duration-200',
      isActive
        ? 'text-brand-700'
        : 'text-ink-500 hover:text-ink-900 hover:bg-ink-100',
    ].join(' ');

  const initials = userName
    ? userName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '';

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 h-16 bg-surface-card/90 backdrop-blur-md border-b border-ink-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left — Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile) */}
            <button
              type="button"
              ref={triggerRef}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-button text-ink-700 hover:bg-ink-100 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              <Menu size={22} />
            </button>

            {/* Logo — the same mark the landing page uses */}
            <NavLink to="/dashboard" aria-label="LinguaFlow home">
              <Logo variant="full" size="sm" />
            </NavLink>
          </div>

          {/* Center — Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-600 rounded-pill"
                        transition={{ duration: 0.25, ease: transitionEase }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right — Stats & Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* XP — amber-700 is the small-text tier (4.8:1); -600 would fail AA */}
            <div className="flex items-center gap-1 text-body-sm font-semibold text-amber-700">
              <Zap size={16} aria-hidden="true" className="text-amber-600" />
              <span className="tabular-nums">{xp.toLocaleString()}</span>
              <span className="sr-only">experience points</span>
            </div>

            {/* Streak — coral-700 for the same reason */}
            <div className="flex items-center gap-1 text-body-sm font-semibold text-coral-700">
              <Flame size={16} aria-hidden="true" className="text-coral-600" />
              <span className="tabular-nums">{streak}</span>
              <span className="sr-only">day streak</span>
            </div>

            {/* Avatar */}
            <NavLink
              to="/profile"
              className="flex items-center justify-center w-9 h-9 rounded-pill bg-brand-100 text-brand-700 font-semibold text-caption overflow-hidden transition-shadow hover:shadow-glow-brand"
              aria-label="Profile"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={userName || 'Profile'}
                  className="w-full h-full object-cover"
                />
              ) : initials ? (
                initials
              ) : (
                <User size={16} />
              )}
            </NavLink>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-nav-overlay bg-black/40 md:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Sidebar panel */}
            <motion.nav
              ref={sidebarRef}
              id="mobile-nav-drawer"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 z-nav-drawer w-72 bg-surface-card shadow-soft-xl md:hidden flex flex-col"
              aria-label="Mobile navigation"
            >
              {/* Close button */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-ink-200">
                <Logo variant="full" size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-button text-ink-700 hover:bg-ink-100 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const LinkIcon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 px-4 h-11 rounded-button text-body-md font-semibold transition-colors duration-150',
                          isActive
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-ink-700 hover:bg-ink-100',
                        ].join(' ')
                      }
                    >
                      <LinkIcon size={20} />
                      {link.label}
                    </NavLink>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;
