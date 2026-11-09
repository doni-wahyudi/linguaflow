/**
 * @file MobileNav.jsx
 * @description Fixed bottom tab navigation for mobile screens (§9). Uses React
 * Router NavLink for active states and Framer Motion for the active-tab pop.
 * Hidden on md+ breakpoints.
 *
 * Contrast: inactive labels used to be `text-[11px] text-ink-400`, which measures
 * 2.52:1 and is unreadable as navigation text. They are now 12px `ink-500` (4.80:1)
 * and the active tone is brand-700 (5.48:1) rather than brand-600 (3.77:1).
 *
 * @example
 * <MobileNav />
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Repeat, Award, PenTool, User } from 'lucide-react';
import { spring } from '../../utils/motion';
import { useAuth } from '../../context/AuthContext';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/lessons', label: 'Lessons', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Repeat },
  { to: '/exams', label: 'Exams', icon: Award },
  { to: '/characters', label: 'Script', icon: PenTool },
  { to: '/profile', label: 'Profile', icon: User },
];

/**
 * Bottom tab bar for mobile devices. Fixed at the bottom, hidden on md+.
 *
 * @returns {JSX.Element}
 */
const MobileNav = () => {
  const { user } = useAuth();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-surface-card border-t border-ink-200 safe-bottom"
      aria-label="Mobile tab navigation"
    >
      {/* §9 bar height is 56px; each tab stays a ≥44px touch target. */}
      <div className="flex items-stretch justify-around h-14">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 text-caption font-semibold transition-colors duration-150"
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <motion.div
                      animate={isActive ? { scale: 1.12 } : { scale: 1 }}
                      transition={spring.pop}
                      className={isActive ? 'text-brand-700' : 'text-ink-500'}
                    >
                      <TabIcon size={20} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
                    </motion.div>
                    {tab.to === '/profile' && user && (
                      <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-pill bg-brand-500 border border-surface-card" />
                    )}
                  </div>
                  <span className={isActive ? 'text-brand-700' : 'text-ink-500'}>{tab.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

MobileNav.displayName = 'MobileNav';

export default MobileNav;
