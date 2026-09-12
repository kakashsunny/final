import React from 'react';
import { Grid3X3, Film, Tag, Bookmark } from 'lucide-react';
import { ProfileTab } from '../types';

interface Props {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  postsCount: number;
  reelsCount: number;
  taggedCount: number;
  savedCount: number;
}

export const ProfileNavTabs: React.FC<Props> = ({
  activeTab,
  onTabChange,
  postsCount,
  reelsCount,
  taggedCount,
  savedCount,
}) => {
  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'posts',
      label: 'POSTS',
      icon: <Grid3X3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />,
      count: postsCount,
    },
    {
      id: 'reels',
      label: 'REELS',
      icon: <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />,
      count: reelsCount,
    },
    {
      id: 'tagged',
      label: 'TAGGED',
      icon: <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />,
      count: taggedCount,
    },
    {
      id: 'saved',
      label: 'SAVED',
      icon: <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />,
      count: savedCount,
    },
  ];

  return (
    <nav
      role="tablist"
      aria-label="Profile section navigation"
      className="flex justify-around sm:justify-center sm:gap-12 md:gap-16 border-t border-neutral-800"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 -mt-px text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-t-sm ${
              isActive
                ? 'border-t border-neutral-100 text-neutral-100'
                : 'border-t border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-400 font-mono">
              {tab.count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
