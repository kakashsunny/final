import React, { useEffect, useRef } from 'react';
import { X, BookOpen, CheckCircle, ShieldCheck, Terminal, Layers, Sparkles, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export const DocumentationModal: React.FC<Props> = ({ isOpen, onClose, triggerRef }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus trap and Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timeout = setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 id="docs-modal-title" className="text-base font-bold text-neutral-100">
                Brief C Final Project Report
              </h2>
              <p className="text-xs text-neutral-400">Rebuilding the Instagram Profile Page Feature</p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            aria-label="Close documentation dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-neutral-300 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Original vs Rebuilt Feature */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Original vs Rebuilt Feature</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2">
                <span className="font-bold text-neutral-100 text-sm">Original Product: Instagram</span>
                <p className="text-neutral-400">
                  A massive social ecosystem combining algorithmic discovery feeds, short-form video feeds, real-time messaging, WebRTC calls, camera filters, e-commerce, and ads.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/60 border border-rose-900/30 space-y-2">
                <span className="font-bold text-rose-300 text-sm">Rebuilt Feature: Profile Page</span>
                <p className="text-neutral-300">
                  Strictly focuses on the single creator representation surface: profile header, real-time follow/message actions, story highlights, accessible tablist, responsive media grid, and accessible post modal.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Intentionally Omitted Features */}
          <section className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-2 text-xs">
            <h3 className="font-bold text-neutral-100 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>What parts were intentionally NOT implemented and why</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-neutral-400">
              <li><strong>Global Explore/Feed</strong>: Excluded to adhere strictly to the single-feature Profile scope constraint.</li>
              <li><strong>Camera & AR Filter Creator</strong>: Complex camera authoring is an ingestion tool, not part of profile consumption.</li>
              <li><strong>Ads Engine & Marketplace</strong>: Excluded to deliver a clean, privacy-conscious user experience.</li>
            </ul>
          </section>

          {/* Section 3: Why this rebuild is better */}
          <section className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2 text-xs">
            <h3 className="font-bold text-emerald-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Accessibility & Usability Advantage over Instagram</span>
            </h3>
            <p className="text-neutral-300">
              <strong>1. Airtight WCAG 2.1 AA Focus Trap & Exact Focus Restoration:</strong> When opening a post or story dialog, keyboard focus is strictly trapped within the active dialog and restored directly to the exact triggering post card thumbnail upon pressing <kbd className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-200">Escape</kbd> or closing.
            </p>
            <p className="text-neutral-300">
              <strong>2. Screen-Reader Politeness:</strong> Dynamic state updates (liking, bookmarking, following, comment submissions) are spoken clearly to screen readers via a dedicated <code className="text-rose-400">aria-live="polite"</code> region.
            </p>
          </section>

          {/* Section 4: How reviewer can demonstrate every state */}
          <section className="space-y-3 text-xs">
            <h3 className="font-bold text-neutral-100 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>How to Demonstrate Every State (No Code Editing Required)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400">
              <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                <strong className="text-emerald-400">1. Success State:</strong> Default 12-post photography grid with interactive likes, comments, stories, and followers modal.
              </div>
              <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                <strong className="text-amber-400">2. Loading State:</strong> Click "Skeleton Loading" in the Reviewer Bar to view the pulsing skeleton layout.
              </div>
              <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                <strong className="text-rose-400">3. Error State:</strong> Click "Error State" in the Reviewer Bar to see "Unable to load profile" with "Try again" recovery.
              </div>
              <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                <strong className="text-sky-400">4. Empty State:</strong> Click "Empty State" or switch to @atelier_studio to view the 0-posts empty illustration.
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
