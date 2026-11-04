/**
 * @file Modal.jsx
 * @description Accessible modal dialog (spec §5.6): blurred backdrop, spring
 * enter / ease-out exit, focus trap, scroll lock, Escape + backdrop dismissal.
 *
 * Design notes:
 * - 20px radius and 32px padding are §5.6 values; earlier builds shipped the
 *   16px card radius with 24px padding because the modal reused the card token.
 * - Focusable queries exclude disabled controls. A disabled button inside the
 *   dialog used to become the trap's "last element", which silently broke
 *   Tab cycling for keyboard users.
 * - Scroll lock is ref-counted so a modal opened from another modal does not
 *   leave `overflow: hidden` on <body> after both close.
 * - Title is wired with `aria-labelledby` rather than `aria-label`, so screen
 *   readers announce the visible heading instead of a duplicate string.
 *
 * @example
 * <Modal isOpen={show} onClose={close} title="Reset progress?"
 *   footer={<Button variant="ghost" onClick={close}>Cancel</Button>}>
 *   <p>This cannot be undone.</p>
 * </Modal>
 */

import React, { useEffect, useId, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { transitionEase } from '../../utils/motion';

/* Keep disabled controls out of the trap: a disabled "Confirm" button used to be
   the last focusable node, so Tab stopped cycling the moment it greyed out. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

/* §5.6 dialog measure — named in tailwind.config so the widths are tokens, not
   inline magic numbers. `xl` exists for the exam/writing readers; the spec listed
   only 480/640/800 and is updated to match. */
const sizeClasses = {
  sm: 'max-w-modal-sm',
  md: 'max-w-modal-md',
  lg: 'max-w-modal-lg',
  xl: 'max-w-modal-xl',
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
    /* §5.6: scale 0.95 → 1.0 in ~200ms. */
    transition: { duration: 0.2, ease: transitionEase },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
};

/* Ref-counted so stacked dialogs cannot strand the scroll lock. */
let lockCount = 0;
const lockScroll = () => {
  lockCount += 1;
  document.body.style.overflow = 'hidden';
};
const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = '';
};

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is visible.
 * @param {Function} props.onClose - Called when the user dismisses the modal.
 * @param {string} [props.title] - Header title, also the accessible name.
 * @param {string} [props.description] - Subtitle wired to aria-describedby.
 * @param {React.ReactNode} props.children - Modal body content.
 * @param {React.ReactNode} [props.footer] - Action row above the bottom padding.
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md'] - Width preset.
 * @param {boolean} [props.showClose=true] - Show the close X button.
 * @param {boolean} [props.dismissOnBackdrop=true] - Close when the backdrop is clicked.
 * @param {string} [props.initialFocus] - Selector for the node to focus instead of the first control.
 * @returns {JSX.Element}
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showClose = true,
  dismissOnBackdrop = true,
  initialFocus,
}) => {
  const contentRef = useRef(null);
  const previousFocusRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  /** Focus trap — keep Tab cycling inside the modal, Escape dismisses. */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab' || !contentRef.current) return;

      const focusable = Array.from(contentRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!contentRef.current.contains(document.activeElement)) {
        /* Something outside grabbed focus (a late re-render, a click landing on
           the backdrop layer): pull it back instead of letting Tab escape. */
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  /** Lock body scroll and move focus in while open. */
  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    lockScroll();

    const timer = setTimeout(() => {
      if (!contentRef.current) return;
      const target =
        (initialFocus && contentRef.current.querySelector(initialFocus)) ||
        contentRef.current.querySelector(FOCUSABLE);
      /* A dialog with no controls still needs focus moved into it, otherwise the
         trap has nothing to hold and Escape stops reaching this subtree. */
      (target || contentRef.current).focus({ preventScroll: true });
    }, 50);

    return () => {
      clearTimeout(timer);
      unlockScroll();
    };
  }, [isOpen, initialFocus]);

  /** Restore focus to the trigger on close. */
  useEffect(() => {
    if (isOpen) return;
    const trigger = previousFocusRef.current;
    previousFocusRef.current = null;
    if (trigger && typeof trigger.focus === 'function' && document.contains(trigger)) {
      trigger.focus({ preventScroll: true });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop — §5.6 rgba(0,0,0,0.4) + 4px blur. */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={dismissOnBackdrop ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Content */}
          <motion.div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descId : undefined}
            aria-label={title ? undefined : 'Dialog'}
            tabIndex={-1}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              'relative z-10 w-full bg-surface-card rounded-modal shadow-soft-xl',
              'max-h-modal overflow-y-auto font-body outline-none',
              sizeClasses[size] || sizeClasses.md,
            ].join(' ')}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 px-8 pt-8 pb-2">
                {title && (
                  <div className="min-w-0">
                    <h2 id={titleId} className="font-display text-display-sm text-ink-900">
                      {title}
                    </h2>
                    {description && (
                      <p id={descId} className="mt-1 text-body-sm text-ink-500">
                        {description}
                      </p>
                    )}
                  </div>
                )}
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className={[
                      '-mr-2 -mt-1 flex items-center justify-center w-9 h-9 rounded-pill shrink-0',
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
            <div className={[!title && !showClose ? 'pt-8' : '', 'px-8 pb-8 pt-2'].join(' ')}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-3 px-8 pb-8">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';

export default Modal;
