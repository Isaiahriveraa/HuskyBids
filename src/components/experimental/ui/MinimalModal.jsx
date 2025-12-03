'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * MinimalModal - Modal component matching experimental minimal design system
 *
 * Features:
 * - Scrollbar compensation to prevent page shift
 * - Dark zinc theme with dotted borders
 * - Escape key and click-outside-to-close support
 * - Portal-based rendering for proper z-index
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {function} onClose - Close handler
 * @param {React.ReactNode} children - Modal content
 * @param {boolean} closeOnOverlayClick - Allow closing by clicking backdrop (default: true)
 */
export default function MinimalModal({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
}) {
  // Handle body scroll lock with scrollbar compensation
  useEffect(() => {
    if (!isOpen) return;

    // Calculate scrollbar width (returns 0 on mobile - correct behavior)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Store original values to restore later
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Apply scroll lock with scrollbar compensation
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore original values
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Portal to body for proper z-index management
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-mono"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-zinc-950 border border-dotted border-zinc-800 w-full max-w-md max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
