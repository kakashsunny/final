import React, { useState, useRef, useEffect } from 'react';
import { ViewState } from '../types';
import { 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  FileQuestion, 
  Users, 
  BookOpen, 
  SlidersHorizontal,
  X,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface Props {
  currentState: ViewState;
  onStateChange: (state: ViewState) => void;
  activeProfileId: string;
  onProfileToggle: () => void;
  onOpenDocs: () => void;
  onSimulateRefresh: () => void;
}

export const ReviewerToolbar: React.FC<Props> = ({
  currentState,
  onStateChange,
  activeProfileId,
  onProfileToggle,
  onOpenDocs,
  onSimulateRefresh,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerBtnRef.current &&
        !triggerBtnRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
        triggerBtnRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const stateLabels: Record<ViewState, { label: string; color: string; icon: React.ReactNode }> = {
    success: {
      label: 'Success',
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    },
    loading: {
      label: 'Loading',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />,
    },
    error: {
      label: 'Error',
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
    },
    empty: {
      label: 'Empty',
      color: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
      icon: <FileQuestion className="w-3.5 h-3.5 text-sky-400" />,
    },
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 font-sans">
      {/* Floating Demo States Trigger */}
      <button
        ref={triggerBtnRef}
        type="button"
        id="btn-demo-states-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Open Demo States and Brief C controls"
        className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 rounded-full shadow-xl backdrop-blur-md transition-all cursor-pointer hover:border-neutral-500 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
      >
        <SlidersHorizontal className="w-4 h-4 text-sky-400" aria-hidden="true" />
        <span className="text-xs font-semibold">Demo States</span>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${stateLabels[currentState].color}`}
        >
          {stateLabels[currentState].icon}
          <span>{stateLabels[currentState].label}</span>
        </span>
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Evaluation State Testing Panel"
          className="absolute bottom-12 right-0 w-80 sm:w-88 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-4 text-neutral-200 space-y-4 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" aria-hidden="true" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Evaluation States
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              aria-label="Close demo states menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Required State Switches */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
              Select Profile State:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                id="btn-state-success"
                onClick={() => {
                  onStateChange('success');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  currentState === 'success'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
                aria-pressed={currentState === 'success'}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Success</span>
              </button>

              <button
                type="button"
                id="btn-state-loading"
                onClick={() => {
                  onStateChange('loading');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  currentState === 'loading'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold'
                    : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
                aria-pressed={currentState === 'loading'}
              >
                <Loader2 className={`w-4 h-4 text-amber-400 flex-shrink-0 ${currentState === 'loading' ? 'animate-spin' : ''}`} />
                <span>Skeleton</span>
              </button>

              <button
                type="button"
                id="btn-state-error"
                onClick={() => {
                  onStateChange('error');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  currentState === 'error'
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-semibold'
                    : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
                aria-pressed={currentState === 'error'}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Error View</span>
              </button>

              <button
                type="button"
                id="btn-state-empty"
                onClick={() => {
                  onStateChange('empty');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  currentState === 'empty'
                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 font-semibold'
                    : 'bg-neutral-950/60 text-neutral-300 border-neutral-800 hover:bg-neutral-800'
                }`}
                aria-pressed={currentState === 'empty'}
              >
                <FileQuestion className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Empty State</span>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-switch-profile"
                onClick={onProfileToggle}
                className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Switch: {activeProfileId === 'user_elena_rosh' ? '@kai.chen' : '@elena.rosh'}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <button
                type="button"
                id="btn-simulate-refresh"
                onClick={onSimulateRefresh}
                title="Simulate network reload"
                className="p-2 rounded-xl bg-neutral-950/60 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
                aria-label="Simulate network reload"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              id="btn-open-brief-c-docs"
              onClick={() => {
                setIsOpen(false);
                onOpenDocs();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-xs font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Project Details & Brief C Report</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

