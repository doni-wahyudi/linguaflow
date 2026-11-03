/**
 * @file PageWrapper.jsx
 * @description Layout wrapper for authenticated pages. Renders the Navbar at top,
 * main content area with consistent max-width and padding, and MobileNav at bottom.
 * Applies a Framer Motion page-enter animation.
 *
 * @example
 * <PageWrapper title="Dashboard">
 *   <DashboardContent />
 * </PageWrapper>
 */

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import { useUser } from '../../context/UserContext';

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Authenticated page layout wrapper.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Page content.
 * @param {string} [props.title] - Optional page heading rendered as an h1.
 * @param {string} [props.className] - Additional classes on the main content area.
 * @param {object} [props.navbarProps] - Props forwarded to the Navbar (xp, streak, etc.).
 * @returns {JSX.Element}
 */
const PageWrapper = ({ children, title, className = '', navbarProps = {} }) => {
  let userCtx = null;
  try {
    userCtx = useUser();
  } catch {
    // If rendered outside UserProvider
  }

  const defaultNavProps = userCtx
    ? {
        xp: userCtx.xp?.totalXP || 0,
        streak: userCtx.streak?.currentStreak || 0,
        userName: userCtx.user?.name || '',
      }
    : {};

  return (
    <div className="min-h-screen bg-surface-bg font-body">
      {/* Top navigation */}
      <Navbar {...defaultNavProps} {...navbarProps} />

      {/* Main content */}
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className={[
          'pt-20 pb-20 md:pb-6',
          'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {title && (
          <h1 className="font-display text-display-md text-ink-900 mb-6">
            {title}
          </h1>
        )}
        {children}
      </motion.main>

      {/* Bottom mobile tabs */}
      <MobileNav />
    </div>
  );
};

PageWrapper.displayName = 'PageWrapper';

export default PageWrapper;
