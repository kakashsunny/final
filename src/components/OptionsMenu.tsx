import React, { useEffect, useRef } from 'react';
import { Share2, QrCode, Link2, ShieldAlert, Ban, Flag, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onCopyLink: () => void;
  onShowQR: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export const OptionsMenu: React.FC<Props> = ({
  isOpen,
  onClose,
  username,
  onCopyLink,
  onShowQR,
  triggerRef,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and Escape key listener
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

    // Initial focus placement
    const timeout = setTimeout(() => {
      firstButtonRef.current?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
      // Focus restoration
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="options-menu-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs sm:max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl text-center divide-y divide-neutral-800 text-sm font-medium"
      >
        <div className="py-3 px-4 text-xs font-semibold text-neutral-400 bg-neutral-950/40">
          <h2 id="options-menu-title" className="sr-only">Profile Options for @{username}</h2>
          <span>Options for @{username}</span>
        </div>

        <button
          ref={firstButtonRef}
          type="button"
          onClick={() => {
            onClose();
            onShowQR();
          }}
          className="w-full py-3.5 px-4 text-neutral-200 hover:bg-neutral-800/80 active:bg-neutral-800 flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:bg-neutral-800 focus-visible:outline-none"
        >
          <QrCode className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <span>QR Code</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            onCopyLink();
          }}
          className="w-full py-3.5 px-4 text-neutral-200 hover:bg-neutral-800/80 active:bg-neutral-800 flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:bg-neutral-800 focus-visible:outline-none"
        >
          <Link2 className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <span>Copy profile link</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${username} on Aura`,
                url: window.location.href,
              }).catch(() => {});
            } else {
              onCopyLink();
            }
            onClose();
          }}
          className="w-full py-3.5 px-4 text-neutral-200 hover:bg-neutral-800/80 active:bg-neutral-800 flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:bg-neutral-800 focus-visible:outline-none"
        >
          <Share2 className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <span>Share to...</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 text-rose-400 hover:bg-rose-950/20 active:bg-rose-950/30 flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:bg-neutral-800 focus-visible:outline-none"
        >
          <Ban className="w-4 h-4" aria-hidden="true" />
          <span>Block account</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 text-rose-400 hover:bg-rose-950/20 active:bg-rose-950/30 flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:bg-neutral-800 focus-visible:outline-none"
        >
          <Flag className="w-4 h-4" aria-hidden="true" />
          <span>Report profile</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-4 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:bg-neutral-800 focus-visible:outline-none font-normal"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
