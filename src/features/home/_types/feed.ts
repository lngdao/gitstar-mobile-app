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

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface FeedAuthor {
  login: string;
  avatarURL: string;
  displayName: string;
}

export interface FeedEvent {
  id: string;
  type: EventType;
  author: FeedAuthor;
  repoOwner: string;
  repoName: string;
  title: string;
  body: string;
  likeCount: number;
  commentCount: number;
  timeAgo: string;
}
