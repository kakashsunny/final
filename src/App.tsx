import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ViewState, 
  ProfileTab, 
  ProfileData, 
  PostItem, 
  StoryHighlight, 
  CommentItem 
} from './types';
import { primaryProfile, alternateProfile, emptyProfile } from './data/mockProfiles';
import { Navbar } from './components/Navbar';
import { ReviewerToolbar } from './components/ReviewerToolbar';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileNavTabs } from './components/ProfileNavTabs';
import { PostGrid } from './components/PostGrid';
import { PostModal } from './components/PostModal';
import { StoryModal } from './components/StoryModal';
import { FollowersModal } from './components/FollowersModal';
import { DirectMessageModal } from './components/DirectMessageModal';
import { OptionsMenu } from './components/OptionsMenu';
import { SkeletonProfile } from './components/SkeletonProfile';
import { ErrorView } from './components/ErrorView';
import { DocumentationModal } from './components/DocumentationModal';
import { ScreenReaderAnnouncer } from './components/ScreenReaderAnnouncer';
import { Sparkles, Check } from 'lucide-react';

export default function App() {
  // Application & Reviewer State
  const [viewState, setViewState] = useState<ViewState>('success');
  const [activeProfileId, setActiveProfileId] = useState<'user_elena_rosh' | 'user_kai_lens' | 'user_new_creator'>('user_elena_rosh');
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [isA11yInspectorActive, setIsA11yInspectorActive] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Data State
  const [profiles, setProfiles] = useState<Record<string, ProfileData>>({
    user_elena_rosh: primaryProfile,
    user_kai_lens: alternateProfile,
    user_new_creator: emptyProfile,
  });

  // Active current profile
  const currentProfile = useMemo(() => {
    if (viewState === 'empty') return emptyProfile;
    return profiles[activeProfileId] || primaryProfile;
  }, [viewState, activeProfileId, profiles]);

  // Modals & Dialogs State
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedHighlight, setSelectedHighlight] = useState<StoryHighlight | null>(null);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following'>('followers');
  const [isDMModalOpen, setIsDMModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  // Focus Restoration Trigger References
  const lastActivePostTriggerRef = useRef<HTMLElement | null>(null);
  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const messageBtnRef = useRef<HTMLButtonElement | null>(null);
  const followersBtnRef = useRef<HTMLButtonElement | null>(null);
  const followingBtnRef = useRef<HTMLButtonElement | null>(null);
  const storyAvatarRef = useRef<HTMLButtonElement | null>(null);
  const docsTriggerRef = useRef<HTMLElement | null>(null);

  // Announce helper
  const triggerAnnouncement = (msg: string) => {
    setAnnouncement(msg);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Follow/Unfollow toggle
  const handleToggleFollow = () => {
    setProfiles((prev) => {
      const target = prev[currentProfile.id];
      if (!target) return prev;
      const nextFollow = !target.isFollowing;
      const nextCount = nextFollow
        ? target.stats.followersCount + 1
        : target.stats.followersCount - 1;

      const updated = {
        ...target,
        isFollowing: nextFollow,
        stats: {
          ...target.stats,
          followersCount: Math.max(0, nextCount),
        },
      };

      triggerAnnouncement(
        nextFollow
          ? `You are now following @${target.username}`
          : `You have unfollowed @${target.username}`
      );

      return { ...prev, [target.id]: updated };
    });
  };

  // Like / Unlike post
  const handleToggleLike = (postId: string) => {
    setProfiles((prev) => {
      const prof = prev[currentProfile.id];
      if (!prof) return prev;

      const updatePost = (p: PostItem): PostItem => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          const nextLikes = nextLiked ? p.likesCount + 1 : p.likesCount - 1;
          triggerAnnouncement(nextLiked ? 'Post liked' : 'Post unliked');
          return { ...p, isLiked: nextLiked, likesCount: Math.max(0, nextLikes) };
        }
        return p;
      };

      const newPosts = prof.posts.map(updatePost);
      const newReels = prof.reels.map(updatePost);
      const newTagged = prof.tagged.map(updatePost);
      const newSaved = prof.saved.map(updatePost);

      // Also update currently open post if matching
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((sp) => (sp ? updatePost(sp) : null));
      }

      return {
        ...prev,
        [prof.id]: {
          ...prof,
          posts: newPosts,
          reels: newReels,
          tagged: newTagged,
          saved: newSaved,
        },
      };
    });
  };

  // Bookmark / Save post
  const handleToggleSave = (postId: string) => {
    setProfiles((prev) => {
      const prof = prev[currentProfile.id];
      if (!prof) return prev;

      const targetPost = prof.posts.find((p) => p.id === postId);
      if (!targetPost) return prev;

      const nextSaved = !targetPost.isSaved;
      triggerAnnouncement(nextSaved ? 'Saved to collection' : 'Removed from collection');

      const updatePost = (p: PostItem): PostItem =>
        p.id === postId ? { ...p, isSaved: nextSaved } : p;

      const newPosts = prof.posts.map(updatePost);
      const newSaved = nextSaved
        ? [...prof.saved, { ...targetPost, isSaved: true }]
        : prof.saved.filter((p) => p.id !== postId);

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((sp) => (sp ? { ...sp, isSaved: nextSaved } : null));
      }

      return {
        ...prev,
        [prof.id]: {
          ...prof,
          posts: newPosts,
          saved: newSaved,
        },
      };
    });
  };

  // Add comment
  const handleAddComment = (postId: string, text: string) => {
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      username: 'you',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      text,
      timestamp: 'Just now',
      likesCount: 0,
      isLiked: false,
    };

    setProfiles((prev) => {
      const prof = prev[currentProfile.id];
      if (!prof) return prev;

      const updatePost = (p: PostItem): PostItem => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments],
          };
        }
        return p;
      };

      const newPosts = prof.posts.map(updatePost);
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost((sp) => (sp ? updatePost(sp) : null));
      }

      triggerAnnouncement(`Comment posted: "${text}"`);

      return {
        ...prev,
        [prof.id]: {
          ...prof,
          posts: newPosts,
        },
      };
    });
  };

  // Switch between sample creator profiles
  const handleToggleProfile = () => {
    setActiveProfileId((curr) =>
      curr === 'user_elena_rosh' ? 'user_kai_lens' : 'user_elena_rosh'
    );
    setViewState('success');
    triggerAnnouncement('Switched profile view');
  };

  // Simulate skeleton reload
  const handleSimulateRefresh = () => {
    setViewState('loading');
    setTimeout(() => {
      setViewState('success');
      triggerAnnouncement('Profile reloaded successfully');
    }, 1200);
  };

  // Filtered posts based on search query
  const displayedPosts = useMemo(() => {
    let sourceList: PostItem[] = [];
    if (activeTab === 'posts') sourceList = currentProfile.posts;
    else if (activeTab === 'reels') sourceList = currentProfile.reels;
    else if (activeTab === 'tagged') sourceList = currentProfile.tagged;
    else if (activeTab === 'saved') sourceList = currentProfile.saved;

    if (!searchQuery.trim()) return sourceList;

    const q = searchQuery.toLowerCase();
    return sourceList.filter(
      (p) =>
        p.caption.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
    );
  }, [currentProfile, activeTab, searchQuery]);

  return (
    <div
      className={`min-h-screen bg-black text-neutral-100 flex flex-col font-sans transition-colors ${
        isA11yInspectorActive ? 'a11y-inspect-mode' : ''
      }`}
    >
      {/* Screen Reader Live Politeness Region */}
      <ScreenReaderAnnouncer announcement={announcement} />

      {/* Reviewer State Switcher Bar */}
      <ReviewerToolbar
        currentState={viewState}
        onStateChange={(s) => {
          setViewState(s);
          triggerAnnouncement(`Switched to ${s} state`);
        }}
        activeProfileId={currentProfile.id}
        onProfileToggle={handleToggleProfile}
        onOpenDocs={() => {
          docsTriggerRef.current = document.getElementById('btn-open-brief-c-docs');
          setIsDocsModalOpen(true);
        }}
        isA11yInspectorActive={isA11yInspectorActive}
        onToggleA11yInspector={() => {
          setIsA11yInspectorActive(!isA11yInspectorActive);
          triggerAnnouncement(
            !isA11yInspectorActive
              ? 'Accessibility focus guide rings activated'
              : 'Accessibility focus guide rings deactivated'
          );
        }}
        onSimulateRefresh={handleSimulateRefresh}
      />

      {/* Top Navigation */}
      <Navbar
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        posts={currentProfile.posts}
        onSelectPost={(p) => {
          setSelectedPost(p);
          triggerAnnouncement(`Opened post dialog: ${p.caption.slice(0, 30)}`);
        }}
        onOpenDocs={() => {
          docsTriggerRef.current = document.getElementById('btn-nav-docs');
          setIsDocsModalOpen(true);
        }}
        avatarUrl={currentProfile.avatarUrl}
        username={currentProfile.username}
      />

      {/* Main Container */}
      <main
        id="main-profile-content"
        tabIndex={-1}
        className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-2 sm:py-4 focus:outline-none"
      >
        {/* State Conditional Render */}
        {viewState === 'loading' ? (
          <SkeletonProfile />
        ) : viewState === 'error' ? (
          <ErrorView
            onRetry={() => {
              setViewState('loading');
              setTimeout(() => {
                setViewState('success');
                triggerAnnouncement('Profile recovered and loaded successfully');
              }, 800);
            }}
            onOpenDocs={() => setIsDocsModalOpen(true)}
          />
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Header */}
            <ProfileHeader
              profile={currentProfile}
              onToggleFollow={handleToggleFollow}
              onOpenMessageModal={() => setIsDMModalOpen(true)}
              onOpenOptionsMenu={() => setIsOptionsMenuOpen(true)}
              onOpenFollowersModal={(tab) => {
                setFollowersModalTab(tab);
                setIsFollowersModalOpen(true);
              }}
              onSelectHighlight={(hl) => {
                setSelectedHighlight(hl);
                triggerAnnouncement(`Opened story highlight: ${hl.title}`);
              }}
              onOpenActiveStory={() => {
                if (currentProfile.highlights.length > 0) {
                  setSelectedHighlight(currentProfile.highlights[0]);
                }
              }}
              moreBtnRef={moreBtnRef}
              messageBtnRef={messageBtnRef}
              followersBtnRef={followersBtnRef}
              followingBtnRef={followingBtnRef}
              storyAvatarRef={storyAvatarRef}
            />

            {/* Profile Navigation Tabs (Posts, Reels, Tagged, Saved) */}
            <ProfileNavTabs
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                triggerAnnouncement(`Switched to ${tab} tab`);
              }}
              postsCount={currentProfile.posts.length}
              reelsCount={currentProfile.reels.length}
              taggedCount={currentProfile.tagged.length}
              savedCount={currentProfile.saved.length}
            />

            {/* Responsive Post Grid */}
            <PostGrid
              posts={displayedPosts}
              activeTab={activeTab}
              onSelectPost={(post, triggerEl) => {
                lastActivePostTriggerRef.current = triggerEl;
                setSelectedPost(post);
                triggerAnnouncement(`Opened post dialog for ${post.caption.slice(0, 30)}`);
              }}
              isFiltered={Boolean(searchQuery.trim())}
              onResetFilter={() => setSearchQuery('')}
              onMockUpload={() => {
                handleSimulateRefresh();
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-400 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Aura Social Profile • Brief C Final Project Rebuild</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsDocsModalOpen(true)}
              className="text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
            >
              Original vs Rebuilt Report
            </button>
            <span>•</span>
            <span className="text-neutral-400">WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-neutral-900/95 border border-neutral-700 text-neutral-100 text-xs font-semibold rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce"
        >
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Accessible Modals */}
      {/* 1. Post Modal with Focus Trap & Focus Restoration */}
      <PostModal
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
        posts={displayedPosts}
        onSelectPost={(p) => setSelectedPost(p)}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
        onAddComment={handleAddComment}
        triggerRef={lastActivePostTriggerRef}
        username={currentProfile.username}
        avatarUrl={currentProfile.avatarUrl}
        isVerified={currentProfile.isVerified}
        onAnnounce={triggerAnnouncement}
      />

      {/* 2. Story Highlights Modal */}
      <StoryModal
        isOpen={Boolean(selectedHighlight)}
        onClose={() => setSelectedHighlight(null)}
        highlight={selectedHighlight}
        triggerRef={storyAvatarRef}
        username={currentProfile.username}
      />

      {/* 3. Followers / Following List Modal */}
      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        initialTab={followersModalTab}
        username={currentProfile.username}
        triggerRef={followersModalTab === 'followers' ? followersBtnRef : followingBtnRef}
        onAnnounce={triggerAnnouncement}
      />

      {/* 4. Direct Message Modal */}
      <DirectMessageModal
        isOpen={isDMModalOpen}
        onClose={() => setIsDMModalOpen(false)}
        profile={currentProfile}
        triggerRef={messageBtnRef}
        onAnnounce={triggerAnnouncement}
      />

      {/* 5. Options Menu Dialog */}
      <OptionsMenu
        isOpen={isOptionsMenuOpen}
        onClose={() => setIsOptionsMenuOpen(false)}
        username={currentProfile.username}
        onCopyLink={() => {
          navigator.clipboard.writeText(window.location.href);
          triggerAnnouncement('Profile URL copied to clipboard');
        }}
        onShowQR={() => {
          triggerAnnouncement('QR code generated for profile');
        }}
        triggerRef={moreBtnRef}
      />

      {/* 6. Brief C In-App Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        triggerRef={docsTriggerRef}
      />
    </div>
  );
}
