import React from 'react';

export const SkeletonProfile: React.FC = () => {
  return (
    <div 
      aria-label="Loading profile content" 
      aria-busy="true" 
      className="animate-pulse space-y-8 max-w-4xl mx-auto py-4 sm:py-6 px-4"
    >
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
        {/* Avatar skeleton */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full bg-neutral-800 flex-shrink-0 border-2 border-neutral-700/50" />

        {/* Info skeleton */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-6 w-36 sm:w-48 bg-neutral-800 rounded-md" />
            <div className="h-8 w-24 bg-neutral-800 rounded-lg" />
            <div className="h-8 w-20 bg-neutral-800 rounded-lg" />
          </div>

          {/* Stats row skeleton */}
          <div className="flex gap-6 sm:gap-8 pt-1">
            <div className="h-4 w-20 bg-neutral-800 rounded-md" />
            <div className="h-4 w-24 bg-neutral-800 rounded-md" />
            <div className="h-4 w-24 bg-neutral-800 rounded-md" />
          </div>

          {/* Bio lines skeleton */}
          <div className="space-y-2 pt-1">
            <div className="h-4 w-40 bg-neutral-800 rounded-md" />
            <div className="h-3.5 w-3/4 bg-neutral-800 rounded-md" />
            <div className="h-3.5 w-1/2 bg-neutral-800 rounded-md" />
            <div className="h-3.5 w-44 bg-neutral-800 rounded-md" />
          </div>
        </div>
      </div>

      {/* Story Highlights Skeleton */}
      <div className="flex gap-4 sm:gap-6 overflow-hidden py-2 border-y border-neutral-900">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-neutral-800 ring-2 ring-neutral-800/80" />
            <div className="w-12 h-3 bg-neutral-800 rounded-md" />
          </div>
        ))}
      </div>

      {/* Tabs Skeleton */}
      <div className="flex justify-center gap-8 sm:gap-16 border-b border-neutral-800/60 pb-3">
        <div className="h-5 w-20 bg-neutral-800 rounded-md" />
        <div className="h-5 w-20 bg-neutral-800 rounded-md" />
        <div className="h-5 w-20 bg-neutral-800 rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <div key={i} className="aspect-square bg-neutral-800/90 rounded-sm sm:rounded-lg" />
        ))}
      </div>
    </div>
  );
};
