/**
 * @file MobileNav.jsx
 * @description Fixed bottom tab navigation for mobile screens. Uses React Router
 * NavLink for active states and Framer Motion for subtle active-tab animations.
 * Hidden on md+ breakpoints.
 *
 * @example
 * <MobileNav />
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, BookOpen, Repeat, Award, PenTool, User } from 'lucide-react';

const tabs = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/lessons', label: 'Lessons', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Repeat },
  { to: '/exams', label: 'Exams', icon: Award },
  { to: '/writing', label: 'Writing', icon: PenTool },
  { to: '/profile', label: 'Profile', icon: User },
];

/**
 * Bottom tab bar for mobile devices. Fixed at the bottom, hidden on md+.
 *
 * @returns {JSX.Element}
 */
const MobileNav = () => {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-ink-200/50 safe-bottom"
      aria-label="Mobile tab navigation"
    >
      <div className="flex items-stretch justify-around h-16">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-colors duration-150"
              aria-label={tab.label}
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={
                      isActive ? 'text-brand-600' : 'text-ink-400'
                    }
                  >
                    <TabIcon size={22} />
                  </motion.div>
                  <span
                    className={
                      isActive ? 'text-brand-600' : 'text-ink-400'
                    }
                  >
                    {tab.label}
                  </span>
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
