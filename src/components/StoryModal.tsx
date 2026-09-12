import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Sparkles } from 'lucide-react';
import { StoryHighlight } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  highlight: StoryHighlight | null;
  triggerRef: React.RefObject<HTMLElement | null>;
  username: string;
}

export const StoryModal: React.FC<Props> = ({
  isOpen,
  onClose,
  highlight,
  triggerRef,
  username,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const stories = highlight?.stories || [];
  const currentStory = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
    setIsPaused(false);
  }, [highlight]);

  // Story progress timer
  useEffect(() => {
    if (!isOpen || !currentStory || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2; // 50 ticks ~ 2.5 seconds per slide
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, currentStory, isPaused, currentIndex, stories.length, onClose]);

  // Keyboard navigation & Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
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
  }, [isOpen, onClose, currentIndex, stories.length, triggerRef]);

  if (!isOpen || !highlight || !currentStory) return null;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((curr) => curr + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((curr) => curr - 1);
      setProgress(0);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-md h-[80vh] max-h-[750px] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
      >
        {/* Story Progress Bars */}
        <div className="absolute top-0 inset-x-0 z-20 p-3 pt-3.5 space-y-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all ease-linear"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Author & Title Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={highlight.coverUrl}
                alt=""
                className="w-8 h-8 rounded-full ring-2 ring-rose-500 object-cover"
              />
              <div>
                <h2 id="story-modal-title" className="text-xs font-bold text-white flex items-center gap-1">
                  <span>@{username}</span>
                  <span className="text-neutral-400 font-normal">• {highlight.title}</span>
                </h2>
                <p className="text-[10px] text-neutral-300">{currentStory.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                aria-label={isPaused ? 'Resume story' : 'Pause story'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>

              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                aria-label="Close story viewer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Story Media */}
        <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentStory.mediaUrl}
            alt={currentStory.caption || `${highlight.title} story slide`}
            className="w-full h-full object-cover select-none"
          />

          {/* Left/Right tap zones */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10 opacity-0"
            aria-label="Previous story slide"
          />
          <button
            type="button"
            onClick={handleNext}
            className="absolute inset-y-0 right-0 w-2/3 cursor-pointer z-10 opacity-0"
            aria-label="Next story slide"
          />

          {/* Floating Arrow Indicators */}
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/90 hover:bg-black/80 z-20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white/90 hover:bg-black/80 z-20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Story Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-0 inset-x-0 p-4 pt-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 text-center">
            <p className="text-xs sm:text-sm text-white font-medium drop-shadow-md">
              {currentStory.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
