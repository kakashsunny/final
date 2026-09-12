import React from 'react';
import { Camera, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  tabName?: string;
  isFiltered?: boolean;
  onResetFilter?: () => void;
  onMockUpload?: () => void;
}

export const EmptyState: React.FC<Props> = ({
  tabName = 'posts',
  isFiltered = false,
  onResetFilter,
  onMockUpload,
}) => {
  return (
    <section 
      aria-label="No content available"
      className="py-16 sm:py-24 px-4 text-center max-w-md mx-auto"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mb-5 shadow-inner">
        <Camera className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.25]" aria-hidden="true" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-neutral-100 tracking-tight mb-2">
        {isFiltered ? 'No matching posts found' : `No ${tabName} yet`}
      </h3>

      <p className="text-xs sm:text-sm text-neutral-400 mb-6 leading-relaxed">
        {isFiltered
          ? 'No photos or reels matched your current search keywords. Try adjusting your query.'
          : tabName === 'saved'
          ? 'Save photos and videos that you want to see again. No one is notified, and only you can see what you’ve saved.'
          : tabName === 'tagged'
          ? 'When people tag this profile in photos and reels, they’ll appear here.'
          : 'When this creator shares photos and videos, they will appear on their profile.'}
      </p>

      {isFiltered && onResetFilter ? (
        <button
          type="button"
          onClick={onResetFilter}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Clear Search Filter</span>
        </button>
      ) : onMockUpload ? (
        <button
          type="button"
          onClick={onMockUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
        >
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Share first photo</span>
        </button>
      ) : null}
    </section>
  );
};
