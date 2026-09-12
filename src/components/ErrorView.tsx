import React from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  onRetry: () => void;
  onOpenDocs: () => void;
}

export const ErrorView: React.FC<Props> = ({ onRetry, onOpenDocs }) => {
  return (
    <main 
      id="main-profile-content"
      className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center focus:outline-none"
      tabIndex={-1}
    >
      <div 
        role="alert" 
        aria-live="assertive"
        className="p-8 sm:p-10 rounded-2xl bg-neutral-900/90 border border-rose-900/50 shadow-2xl backdrop-blur-md relative overflow-hidden"
      >
        {/* Subtle decorative glowing badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-inner">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 tracking-tight mb-2">
          Unable to load profile
        </h1>
        
        <p className="text-sm text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
          The requested profile data could not be retrieved from the server. This may be due to a temporary network disruption, rate limit, or simulated error state.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            id="btn-error-retry"
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm shadow-md hover:shadow-rose-600/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:outline-none"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Try again</span>
          </button>

          <button
            type="button"
            id="btn-error-docs"
            onClick={onOpenDocs}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/80 font-semibold text-sm transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 focus-visible:outline-none"
          >
            <Sparkles className="w-4 h-4 text-rose-400" aria-hidden="true" />
            <span>Review Brief C Specs</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 text-xs text-neutral-400 flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400/80 flex-shrink-0" />
          <span>Reviewer Note: You can also use the top Reviewer Toolbar to toggle states anytime.</span>
        </div>
      </div>
    </main>
  );
};
