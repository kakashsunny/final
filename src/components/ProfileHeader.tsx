import React from 'react';
import { 
  Check, 
  MoreHorizontal, 
  ExternalLink, 
  Camera,
  ChevronDown
} from 'lucide-react';
import { ProfileData, StoryHighlight } from '../types';

interface Props {
  profile: ProfileData;
  onToggleFollow: () => void;
  onOpenMessageModal: () => void;
  onOpenOptionsMenu: () => void;
  onOpenFollowersModal: (tab: 'followers' | 'following') => void;
  onSelectHighlight: (highlight: StoryHighlight) => void;
  onOpenActiveStory: () => void;
  moreBtnRef: React.RefObject<HTMLButtonElement | null>;
  messageBtnRef: React.RefObject<HTMLButtonElement | null>;
  followersBtnRef: React.RefObject<HTMLButtonElement | null>;
  followingBtnRef: React.RefObject<HTMLButtonElement | null>;
  storyAvatarRef: React.RefObject<HTMLButtonElement | null>;
}

export const ProfileHeader: React.FC<Props> = ({
  profile,
  onToggleFollow,
  onOpenMessageModal,
  onOpenOptionsMenu,
  onOpenFollowersModal,
  onSelectHighlight,
  onOpenActiveStory,
  moreBtnRef,
  messageBtnRef,
  followersBtnRef,
  followingBtnRef,
  storyAvatarRef,
}) => {
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <header className="py-4 sm:py-7 space-y-6 sm:space-y-8" aria-label="Creator profile header">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 sm:gap-8 md:gap-14">
        {/* Profile Avatar Column */}
        <div className="flex items-center gap-5 md:block md:w-40 flex-shrink-0">
          <div className="relative">
            <button
              ref={storyAvatarRef}
              type="button"
              onClick={profile.hasActiveStory ? onOpenActiveStory : undefined}
              className={`group relative rounded-full p-0.5 sm:p-1 transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none cursor-pointer ${
                profile.hasActiveStory
                  ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600'
                  : 'bg-neutral-800'
              }`}
              aria-label={
                profile.hasActiveStory
                  ? `View active story for @${profile.username}`
                  : `Profile photo for @${profile.username}`
              }
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden bg-neutral-900 ring-2 ring-black">
                <img
                  src={profile.avatarUrl}
                  alt={`Avatar of ${profile.displayName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {profile.hasActiveStory && (
                <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-rose-600 text-white p-1 sm:p-1.5 rounded-full border-2 border-black shadow-md">
                  <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" aria-hidden="true" />
                </span>
              )}
            </button>
          </div>

          {/* Mobile username and action row */}
          <div className="md:hidden flex-1 space-y-2.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-neutral-100 truncate">
                {profile.username}
              </h1>
              {profile.isVerified && (
                <span
                  title="Verified Creator"
                  className="w-4 h-4 rounded-full bg-[#0095f6] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0"
                >
                  ✓
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleFollow}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  profile.isFollowing
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    : 'bg-[#0095f6] hover:bg-[#1877f2] text-white'
                }`}
                aria-pressed={profile.isFollowing}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>

              <button
                type="button"
                onClick={onOpenMessageModal}
                className="py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-xs font-semibold cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              >
                Message
              </button>

              <button
                type="button"
                onClick={onOpenOptionsMenu}
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
                aria-label="More options for this profile"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info Details (Desktop & Tablet) */}
        <div className="flex-1 space-y-4 w-full">
          {/* Top Row: Username & Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-5 flex-wrap">
            <h1 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
              <span>{profile.username}</span>
              {profile.isVerified && (
                <span
                  title="Verified Account"
                  className="w-4 h-4 rounded-full bg-[#0095f6] text-white flex items-center justify-center text-[10px] font-black"
                >
                  ✓
                </span>
              )}
            </h1>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-profile-follow"
                onClick={onToggleFollow}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none ${
                  profile.isFollowing
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                    : 'bg-[#0095f6] hover:bg-[#1877f2] text-white shadow-xs'
                }`}
                aria-pressed={profile.isFollowing}
                aria-label={profile.isFollowing ? `Unfollow @${profile.username}` : `Follow @${profile.username}`}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </button>

              <button
                ref={messageBtnRef}
                type="button"
                id="btn-profile-message"
                onClick={onOpenMessageModal}
                className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
              >
                Message
              </button>

              <button
                ref={moreBtnRef}
                type="button"
                id="btn-profile-options"
                onClick={onOpenOptionsMenu}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
                aria-label="More profile options"
                aria-haspopup="dialog"
              >
                <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Stats Count Row */}
          <div className="flex items-center justify-around md:justify-start gap-8 sm:gap-10 py-2.5 sm:py-0 border-y md:border-y-0 border-neutral-900 text-sm">
            <div className="flex flex-col sm:flex-row items-center sm:gap-1.5">
              <span className="font-bold text-neutral-100">{formatNumber(profile.stats.postsCount)}</span>
              <span className="text-neutral-400 font-normal">posts</span>
            </div>

            <button
              ref={followersBtnRef}
              type="button"
              onClick={() => onOpenFollowersModal('followers')}
              className="flex flex-col sm:flex-row items-center sm:gap-1.5 hover:text-sky-400 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-md px-1"
              aria-label={`${formatNumber(profile.stats.followersCount)} followers. Click to view accounts.`}
            >
              <span className="font-bold text-neutral-100">{formatNumber(profile.stats.followersCount)}</span>
              <span className="text-neutral-400 font-normal">followers</span>
            </button>

            <button
              ref={followingBtnRef}
              type="button"
              onClick={() => onOpenFollowersModal('following')}
              className="flex flex-col sm:flex-row items-center sm:gap-1.5 hover:text-sky-400 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-md px-1"
              aria-label={`${formatNumber(profile.stats.followingCount)} following. Click to view accounts.`}
            >
              <span className="font-bold text-neutral-100">{formatNumber(profile.stats.followingCount)}</span>
              <span className="text-neutral-400 font-normal">following</span>
            </button>
          </div>

          {/* Bio & Links */}
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-neutral-100">{profile.displayName}</p>
            {profile.category && (
              <p className="text-neutral-400 text-xs font-medium">{profile.category}</p>
            )}
            
            {/* Bio with parsed hashtags and mentions */}
            <p className="text-neutral-200 whitespace-pre-line leading-relaxed font-normal pt-0.5">
              {profile.bio.split(/(\s+)/).map((word, i) => {
                if (word.startsWith('@') || word.startsWith('#')) {
                  return (
                    <span key={i} className="text-sky-400 hover:text-sky-300 font-medium cursor-pointer">
                      {word}
                    </span>
                  );
                }
                return word;
              })}
            </p>

            {/* External Links */}
            {profile.bioLinks && profile.bioLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-1.5">
                {profile.bioLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{link.title}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story Highlights Carousel */}
      {profile.highlights && profile.highlights.length > 0 && (
        <div 
          role="region" 
          aria-label="Story Highlights"
          className="pt-2 pb-1 border-t border-neutral-900/80 overflow-x-auto scrollbar-none"
        >
          <div className="flex items-center gap-5 sm:gap-7 min-w-max pb-1">
            {profile.highlights.map((hl) => (
              <button
                key={hl.id}
                type="button"
                onClick={() => onSelectHighlight(hl)}
                className="group flex flex-col items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-xl p-1"
                aria-label={`View story highlight: ${hl.title}`}
              >
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 bg-neutral-900 border border-neutral-800 group-hover:border-neutral-500 transition-colors">
                  <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 ring-2 ring-black">
                    <img
                      src={hl.coverUrl}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-neutral-300 group-hover:text-white max-w-[72px] truncate text-center">
                  {hl.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

