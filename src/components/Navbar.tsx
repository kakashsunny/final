import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Heart, 
  BookOpen, 
  Camera,
  Compass,
  MessageCircle
} from 'lucide-react';
import { PostItem } from '../types';

interface Props {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  posts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onOpenDocs: () => void;
  avatarUrl: string;
  username: string;
}

export const Navbar: React.FC<Props> = ({
  onSearchChange,
  searchQuery,
  posts,
  onSelectPost,
  onOpenDocs,
  avatarUrl,
  username,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Filter preview results
  const filteredSuggestions = searchQuery.trim()
    ? posts.filter(
        (p) =>
          p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 4)
    : [];

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-black/85 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      {/* Skip to Content Accessible Link */}
      <a
        href="#main-profile-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:font-semibold focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main profile content
      </a>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <a
            href="#main-profile-content"
            className="group flex items-center gap-2 text-neutral-100 font-bold tracking-tight focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-lg p-1"
            aria-label="Aura Profile Homepage"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-neutral-900 border border-neutral-700/80 flex items-center justify-center group-hover:border-neutral-500 transition-colors">
              <Camera className="w-4 h-4 text-neutral-200 group-hover:text-white transition-colors" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-wider text-neutral-100">
              Aura
            </span>
          </a>
        </div>

        {/* Center: Search Field */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <label htmlFor="top-search-input" className="sr-only">
            Search profile posts, captions, or hashtags
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              ref={searchInputRef}
              id="top-search-input"
              type="search"
              role="searchbox"
              placeholder="Search posts or #tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-neutral-900/90 text-neutral-200 placeholder-neutral-500 rounded-lg border border-neutral-800 focus:border-neutral-600 focus:bg-neutral-900 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-neutral-200 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded cursor-pointer"
                aria-label="Clear search query"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Live Search Autocomplete Popover */}
          {isSearchFocused && searchQuery.trim() && (
            <div 
              role="listbox" 
              aria-label="Search Results"
              className="absolute left-0 right-0 top-full mt-1.5 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 py-1"
            >
              {filteredSuggestions.length > 0 ? (
                <>
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-neutral-400 border-b border-neutral-800 uppercase tracking-wider">
                    Found {filteredSuggestions.length} matching posts
                  </div>
                  {filteredSuggestions.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onMouseDown={() => onSelectPost(post)}
                      className="w-full px-3 py-2 flex items-center gap-3 text-left hover:bg-neutral-800/80 transition-colors focus-visible:bg-neutral-800 focus-visible:outline-none cursor-pointer"
                    >
                      <img
                        src={post.thumbnail}
                        alt=""
                        className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-neutral-200 line-clamp-1 font-medium">
                          {post.caption}
                        </p>
                        <p className="text-[11px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span>❤️ {post.likesCount.toLocaleString()}</span>
                          <span>💬 {post.commentsCount}</span>
                          {post.location && <span>📍 {post.location}</span>}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-4 py-3 text-center text-xs text-neutral-400">
                  No posts matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Action Icons */}
        <nav aria-label="Quick Actions" className="flex items-center gap-1 sm:gap-2">
          {/* Notifications Trigger */}
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              id="btn-notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors relative cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              aria-label="Notifications (3 unread)"
              aria-expanded={showNotifications}
              aria-haspopup="dialog"
            >
              <Heart className="w-5 h-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-neutral-950" />
            </button>

            {showNotifications && (
              <div
                role="dialog"
                aria-label="Recent activity notifications"
                className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl z-50 p-2 text-xs animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-2.5 py-1.5 font-bold text-sm text-neutral-100 border-b border-neutral-800 mb-1">
                  Notifications
                </div>
                <div className="space-y-1">
                  <div className="p-2 rounded-lg hover:bg-neutral-800/60 flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-200">
                        <strong className="font-semibold">marcus.arch</strong> liked your photo.
                      </p>
                      <span className="text-[10px] text-neutral-400">10m ago</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg hover:bg-neutral-800/60 flex items-center gap-2.5">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                      alt=""
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-200">
                        <strong className="font-semibold">nordic_spaces</strong> started following you.
                      </p>
                      <span className="text-[10px] text-neutral-400">1h ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* In-app Project Details / Brief C Docs button */}
          <button
            type="button"
            id="btn-nav-docs"
            onClick={onOpenDocs}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
            aria-label="View Project Details and Brief C Report"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
            <span>Project Details</span>
          </button>

          {/* Active Profile Avatar Badge */}
          <div className="pl-1 flex items-center">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1 ring-neutral-700 overflow-hidden bg-neutral-800 flex-shrink-0">
              <img
                src={avatarUrl}
                alt={`Signed in avatar for @${username}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

