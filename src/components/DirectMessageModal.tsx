import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Sparkles, CheckCheck } from 'lucide-react';
import { ProfileData } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  triggerRef: React.RefObject<HTMLElement | null>;
  onAnnounce: (msg: string) => void;
}

export const DirectMessageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  profile,
  triggerRef,
  onAnnounce,
}) => {
  const [messageText, setMessageText] = useState('');
  const [isSent, setIsSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus trap and Escape key
  useEffect(() => {
    if (!isOpen) {
      setMessageText('');
      setIsSent(false);
      return;
    }

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
    const timeout = setTimeout(() => textareaRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSent(true);
    onAnnounce(`Message sent to @${profile.username}: "${messageText}"`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/40">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={profile.avatarUrl}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700 flex-shrink-0"
            />
            <div className="truncate">
              <h2 id="dm-modal-title" className="text-sm font-bold text-neutral-100 truncate">
                Direct Message @{profile.username}
              </h2>
              <p className="text-[11px] text-neutral-400 truncate">{profile.displayName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            aria-label="Close message dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <CheckCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-neutral-100">Message Delivered!</h3>
            <p className="text-xs text-neutral-400">
              Your inquiry has been sent to @{profile.username}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-4 space-y-4">
            <div>
              <label htmlFor="dm-message-input" className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Compose message:
              </label>
              <textarea
                ref={textareaRef}
                id="dm-message-input"
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={`Hi @${profile.username}, I really love your architectural photography prints...`}
                className="w-full px-3 py-2.5 bg-neutral-950 text-neutral-100 placeholder-neutral-500 rounded-xl border border-neutral-800 focus:border-neutral-600 focus:ring-2 focus:ring-rose-500/40 text-xs sm:text-sm focus:outline-none resize-none"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant Profile Inquiry</span>
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
