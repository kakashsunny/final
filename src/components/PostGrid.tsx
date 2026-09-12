import React from 'react';
import { Heart, MessageCircle, Copy, Play, Pin, Sparkles } from 'lucide-react';
import { PostItem, ProfileTab } from '../types';
import { EmptyState } from './EmptyState';

interface Props {
  posts: PostItem[];
  activeTab: ProfileTab;
  onSelectPost: (post: PostItem, triggerEl: HTMLElement) => void;
  isFiltered?: boolean;
  onResetFilter?: () => void;
  onMockUpload?: () => void;
}

export const PostGrid: React.FC<Props> = ({
  posts,
  activeTab,
  onSelectPost,
  isFiltered,
  onResetFilter,
  onMockUpload,
}) => {
  if (posts.length === 0) {
    return (
      <EmptyState
        tabName={activeTab}
        isFiltered={isFiltered}
        onResetFilter={onResetFilter}
        onMockUpload={onMockUpload}
      />
    );
  }

  return (
    <section
      id={`panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      className="py-4 sm:py-6"
    >
      <div className="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6">
        {posts.map((post) => {
          const isCarousel = post.type === 'carousel' || (post.mediaGallery && post.mediaGallery.length > 1);
          const isReel = post.type === 'reel';

          return (
            <button
              key={post.id}
              id={`post-card-${post.id}`}
              type="button"
              onClick={(e) => onSelectPost(post, e.currentTarget)}
              className="group relative aspect-square bg-neutral-900 overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none transition-all"
              aria-label={`View post: ${post.caption.slice(0, 50)}... ${post.likesCount.toLocaleString()} likes, ${post.commentsCount} comments.`}
            >
              {/* Media Thumbnail */}
              <img
                src={post.thumbnail}
                alt={post.altText}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 group-focus-visible:scale-105 transition-transform duration-300 ease-out"
              />

              {/* Badges in Top Right/Left */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-none z-10">
                {isCarousel && (
                  <span
                    className="p-1 rounded-md bg-neutral-950/70 text-white backdrop-blur-xs shadow-md"
                    title="Carousel post"
                  >
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  </span>
                )}
                {isReel && (
                  <span
                    className="p-1 rounded-md bg-neutral-950/70 text-white backdrop-blur-xs shadow-md"
                    title="Reel video"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" aria-hidden="true" />
                  </span>
                )}
              </div>

              {post.isPinned && (
                <div className="absolute top-2 left-2 pointer-events-none z-10">
                  <span className="p-1 rounded-md bg-neutral-950/70 text-amber-400 backdrop-blur-xs shadow-md flex items-center">
                    <Pin className="w-3.5 h-3.5 fill-amber-400" aria-hidden="true" />
                  </span>
                </div>
              )}

              {/* Hover and Focus Engagement Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4 sm:gap-8 text-white font-bold text-xs sm:text-base z-20">
                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" aria-hidden="true" />
                  <span>{post.likesCount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1.5 drop-shadow-md">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white" aria-hidden="true" />
                  <span>{post.commentsCount}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
