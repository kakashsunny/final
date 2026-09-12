import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Check, UserPlus, Sparkles } from 'lucide-react';
import { UserAccount } from '../types';
import { sampleFollowersList } from '../data/mockProfiles';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'followers' | 'following';
  username: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  onAnnounce: (msg: string) => void;
}

export const FollowersModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab,
  username,
  triggerRef,
  onAnnounce,
}) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserAccount[]>(sampleFollowersList);
  const dialogRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

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
    const timeout = setTimeout(() => searchInputRef.current?.focus(), 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const toggleFollowUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextState = !u.isFollowing;
          onAnnounce(nextState ? `Following @${u.username}` : `Unfollowed @${u.username}`);
          return { ...u, isFollowing: nextState };
        }
        return u;
      })
    );
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="followers-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm sm:max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/50">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('followers')}
              className={`text-sm font-bold pb-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none rounded ${
                activeTab === 'followers'
                  ? 'text-neutral-100 border-b-2 border-rose-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Followers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`text-sm font-bold pb-1 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none rounded ${
                activeTab === 'following'
                  ? 'text-neutral-100 border-b-2 border-rose-500'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Following
            </button>
          </div>

          <h2 id="followers-modal-title" className="sr-only">
            {activeTab === 'followers' ? 'Followers list' : 'Following list'} for @{username}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Search inside accounts */}
        <div className="p-3 border-b border-neutral-800">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accounts..."
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 text-neutral-200 placeholder-neutral-500 rounded-xl border border-neutral-800 text-xs focus:border-neutral-600 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-neutral-800/40">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-neutral-800/50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-200 truncate flex items-center gap-1">
                      <span>{user.username}</span>
                      {user.isVerified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-black">
                          ✓
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">{user.displayName}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFollowUser(user.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none ${
                    user.isFollowing
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500">
              No accounts found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
