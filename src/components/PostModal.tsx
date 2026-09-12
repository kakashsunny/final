import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Sparkles,
  MapPin,
  Smile,
  Pin
} from 'lucide-react';
import { PostItem, CommentItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  post: PostItem | null;
  posts: PostItem[];
  onSelectPost: (post: PostItem) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  onAnnounce: (msg: string) => void;
}

export const PostModal: React.FC<Props> = ({
  isOpen,
  onClose,
  post,
  posts,
  onSelectPost,
  onToggleLike,
  onToggleSave,
  onAddComment,
  triggerRef,
  username,
  avatarUrl,
  isVerified,
  onAnnounce,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = posts.findIndex((p) => p.id === post?.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < posts.length - 1 && currentIndex !== -1;

  useEffect(() => {
    setActiveCarouselIdx(0);
    setCommentInput('');
  }, [post?.id]);

  // Keyboard navigation & Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        if (hasNext) {
          e.preventDefault();
          onSelectPost(posts[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev) {
          e.preventDefault();
          onSelectPost(posts[currentIndex - 1]);
        }
      }

      // Trap focus
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
      // Strict focus restoration
      triggerRef.current?.focus();
    };
  }, [isOpen, onClose, hasNext, hasPrev, currentIndex, posts, onSelectPost, triggerRef]);

  if (!isOpen || !post) return null;

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onToggleLike(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const gallery = post.mediaGallery || [post.mediaUrl];
  const currentImage = gallery[activeCarouselIdx] || post.mediaUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-modal-author"
      aria-describedby="post-modal-caption"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Floating Prev/Next Navigation Controls */}
      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPost(posts[currentIndex - 1]);
          }}
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700/80 items-center justify-center shadow-2xl z-50 transition-transform hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          aria-label="Previous post (Left arrow key)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPost(posts[currentIndex + 1]);
          }}
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900/90 text-white hover:bg-neutral-800 border border-neutral-700/80 items-center justify-center shadow-2xl z-50 transition-transform hover:scale-110 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
          aria-label="Next post (Right arrow key)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Post Card Container */}
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left / Top: Media Column */}
        <div 
          className="relative w-full md:w-3/5 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[550px] overflow-hidden select-none cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={currentImage}
            alt={post.altText}
            className="w-full h-full max-h-[55vh] md:max-h-[85vh] object-contain"
          />

          {/* Double tap heart animation burst */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
              <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl" />
            </div>
          )}

          {/* Carousel indicators */}
          {gallery.length > 1 && (
            <>
              {activeCarouselIdx > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCarouselIdx((prev) => prev - 1);
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 z-20 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  aria-label="Previous carousel image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {activeCarouselIdx < gallery.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCarouselIdx((prev) => prev + 1);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 z-20 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  aria-label="Next carousel image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === activeCarouselIdx ? 'bg-white w-3' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {post.isPinned && (
            <div className="absolute top-3 left-3 bg-neutral-900/90 text-neutral-200 border border-neutral-700/60 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Pin className="w-3 h-3 text-amber-400" />
              <span>Pinned</span>
            </div>
          )}
        </div>

        {/* Right Column: Post details, comments, and engagement actions */}
        <div className="w-full md:w-2/5 flex flex-col justify-between bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-800">
          {/* Header Row */}
          <div className="p-3 sm:p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={avatarUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h2 id="post-modal-author" className="text-xs sm:text-sm font-bold text-neutral-100 truncate">
                    {username}
                  </h2>
                  {isVerified && (
                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[8px] font-black">
                      ✓
                    </span>
                  )}
                </div>
                {post.location && (
                  <p className="text-[11px] text-neutral-400 flex items-center gap-0.5 truncate">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{post.location}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
                aria-label="Close dialog (Escape key)"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Comments & Caption Scroll Area */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto max-h-[220px] sm:max-h-[300px] md:max-h-[380px] space-y-4 text-xs">
            {/* Main Author Caption */}
            <div className="flex items-start gap-3">
              <img
                src={avatarUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-800 flex-shrink-0 mt-0.5"
              />
              <div className="space-y-1 flex-1">
                <p id="post-modal-caption" className="text-neutral-200 leading-relaxed">
                  <span className="font-semibold text-neutral-100 mr-1.5">{username}</span>
                  {post.caption}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <time>{post.timestamp}</time>
                  <span>•</span>
                  <span>{post.type.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Comment List */}
            {post.comments.length > 0 ? (
              <div className="space-y-3 pt-2 border-t border-neutral-800/60">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start justify-between gap-2 group">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <img
                        src={comment.userAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-800 flex-shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-neutral-300 leading-snug">
                          <strong className="font-semibold text-neutral-100 mr-1.5">
                            {comment.username}
                          </strong>
                          {comment.text}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                          <span>{comment.timestamp}</span>
                          {comment.likesCount > 0 && (
                            <span>{comment.likesCount} {comment.likesCount === 1 ? 'like' : 'likes'}</span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setCommentInput(`@${comment.username} `);
                              commentInputRef.current?.focus();
                            }}
                            className="hover:text-neutral-200 cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 text-neutral-400 hover:text-rose-500 cursor-pointer focus-visible:ring-1 focus-visible:ring-sky-400 rounded"
                      aria-label={`Like comment by ${comment.username}`}
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-neutral-400 text-xs">
                No comments yet. Be the first to start the conversation!
              </div>
            )}
          </div>

          {/* Action Row (Like, Comment, Share, Bookmark) */}
          <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-post-modal-like"
                  onClick={() => onToggleLike(post.id)}
                  className={`p-1 text-neutral-200 hover:text-white transition-transform active:scale-125 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-md ${
                    post.isLiked ? 'text-rose-500 fill-rose-500' : ''
                  }`}
                  aria-label={post.isLiked ? 'Unlike this post' : 'Like this post'}
                  aria-pressed={post.isLiked}
                >
                  <Heart
                    className={`w-6 h-6 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => commentInputRef.current?.focus()}
                  className="p-1 text-neutral-200 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-md"
                  aria-label="Add a comment"
                >
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    onAnnounce('Post link copied to clipboard');
                  }}
                  className="p-1 text-neutral-200 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-md"
                  aria-label="Share post"
                >
                  <Share2 className="w-6 h-6" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                id="btn-post-modal-save"
                onClick={() => onToggleSave(post.id)}
                className={`p-1 text-neutral-200 hover:text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none rounded-md ${
                  post.isSaved ? 'text-neutral-100 fill-neutral-100' : ''
                }`}
                aria-label={post.isSaved ? 'Remove from saved' : 'Save post to collection'}
                aria-pressed={post.isSaved}
              >
                <Bookmark
                  className={`w-6 h-6 ${post.isSaved ? 'fill-neutral-100 text-neutral-100' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Engagement Counts */}
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-neutral-100">
                {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
              </p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider">
                {post.timestamp}
              </p>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-neutral-800/80 flex items-center gap-2">
              <input
                ref={commentInputRef}
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="text-xs font-bold text-sky-400 hover:text-sky-300 disabled:text-neutral-600 cursor-pointer disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-sky-400 rounded px-1"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
