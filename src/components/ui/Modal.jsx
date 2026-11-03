/**
 * @file Modal.jsx
 * @description Accessible modal dialog with backdrop blur, Framer Motion enter/exit
 * animations, focus trapping, and keyboard dismissal.
 *
 * @example
 * <Modal isOpen={show} onClose={() => setShow(false)} title="Confirm">
 *   <p>Are you sure?</p>
 * </Modal>
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const transitionEase = [0.16, 1, 0.3, 1];

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: transitionEase },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

/**
 * Modal dialog with animated backdrop, focus trap, and keyboard support.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Called when the user dismisses the modal.
 * @param {string} [props.title] - Optional header title.
 * @param {React.ReactNode} props.children - Modal body content.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Width preset.
 * @param {boolean} [props.showClose=true] - Show the close X button.
 * @returns {JSX.Element}
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}) => {
  const contentRef = useRef(null);
  const previousFocusRef = useRef(null);

  /** Focus trap — keep tab cycling inside the modal. */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose],
  );

  /** Lock body scroll and manage focus on open/close. */
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';

      // Defer initial focus into modal
      const timer = setTimeout(() => {
        if (contentRef.current) {
          const firstFocusable = contentRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          firstFocusable?.focus();
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Content */}
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-label={title || 'Dialog'}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              'relative z-10 w-full bg-white rounded-card shadow-soft-xl',
              'overflow-hidden font-body',
              sizeClasses[size],
            ].join(' ')}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                {title && (
                  <h2 className="font-display text-display-sm text-ink-900">
                    {title}
                  </h2>
                )}
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className={[
                      'ml-auto flex items-center justify-center w-8 h-8 rounded-full',
                      'text-ink-500 hover:bg-ink-100 hover:text-ink-900',
                      'transition-colors duration-150',
                    ].join(' ')}
                    aria-label="Close dialog"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';

export default Modal;
