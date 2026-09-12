export type ViewState = 'success' | 'loading' | 'error' | 'empty';

export type ProfileTab = 'posts' | 'reels' | 'tagged' | 'saved';

export interface CommentItem {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked: boolean;
}

export interface PostItem {
  id: string;
  type: 'photo' | 'reel' | 'carousel';
  mediaUrl: string;
  mediaGallery?: string[];
  thumbnail: string;
  altText: string;
  caption: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isPinned?: boolean;
  viewsCount?: number; // for reels
  tags: string[];
  comments: CommentItem[];
  location?: string;
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  timestamp: string;
  caption?: string;
}

export interface StoryHighlight {
  id: string;
  title: string;
  coverUrl: string;
  stories: StoryItem[];
}

export interface UserAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  isFollowing: boolean;
  followsYou?: boolean;
}

export interface ProfileData {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
  category: string;
  bio: string;
  bioLinks: { title: string; url: string }[];
  location?: string;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
  isFollowing: boolean;
  isCurrentUser: boolean;
  hasActiveStory: boolean;
  highlights: StoryHighlight[];
  posts: PostItem[];
  reels: PostItem[];
  tagged: PostItem[];
  saved: PostItem[];
}
