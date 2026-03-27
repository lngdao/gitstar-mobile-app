export const HOME_TABS = {
  community: 'Community',
  forYou: 'For You',
  agents: 'Agents',
} as const;

export type HomeTabKey = keyof typeof HOME_TABS;

export const EVENT_TYPES = {
  issue: 'issue',
  pr: 'pull_request',
  commit: 'commit',
  release: 'release',
} as const;

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES] | string;

export type FilterType = 'about' | 'all' | 'commit' | 'pr' | 'issue' | 'release';

// --- Event Author ---
export interface EventAuthor {
  login: string;
  avatar_url: string | null;
}

// --- Narration (AI-generated summary) ---
export interface Narration {
  body: string;
  event_description: string | null;
  detected_agent: string | null;
  human_ratio: number;
  agent_ratio: number;
}

// --- Feed Event (single repo event) ---
export interface FeedEvent {
  id: string;
  type: EventType;
  github_id: string;
  title: string;
  body?: string;
  author: EventAuthor;
  narration: Narration;
  additions: number;
  deletions: number;
  files_changed: number;
  state?: string;
  labels?: string[];
  comments?: number;
  branch_name?: string;
  event_created_at: string;
}

// --- Home Feed Event (multi-repo, includes repo info) ---
export interface HomeFeedEvent extends FeedEvent {
  repo_owner: string;
  repo_name: string;
}

// --- Pagination ---
export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  has_next: boolean;
}

// --- Home Feed API Response ---
export interface HomeFeedResponse {
  data: {
    events: HomeFeedEvent[];
    pagination: Pagination;
  };
  cached: boolean;
}

// --- Repo Tag ---
export interface RepoTag {
  name: string;
  owner: string;
  is_private: boolean;
}

// --- Community Post ---
export interface CommunityPost {
  id: string;
  author_login: string;
  author_name: string | null;
  author_avatar: string | null;
  body: string;
  visibility: string;
  repo_tags: RepoTag[];
  image_urls: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  like_count: number;
  liked: boolean;
  comment_count: number;
  quoted_event_key: string | null;
  quoted_post_id: string | null;
}

// --- Community Posts Pagination ---
export interface PostsPagination {
  has_more: boolean;
  next_cursor: string | null;
  next_cursor_id: string | null;
}

// --- Community Posts API Response ---
export interface PostsResponse {
  data: {
    posts: CommunityPost[];
    pagination: PostsPagination;
  };
}
