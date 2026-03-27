import { useInfiniteQuery, useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import axios from 'axios';
import { ENV } from '@/config/environment';
import { getStorage } from '@/libs/storage';
import { createLogger } from '@/utils/logger';
import type {
  HomeFeedResponse,
  HomeFeedEvent,
  FilterType,
  PostsResponse,
  CommunityPost,
} from '@/features/home/_types';

const logger = createLogger('HomeQueries');

// --- Fingerprint (anonymous device identifier for like/reaction endpoints) ---

const FINGERPRINT_KEY = 'app.fingerprint';

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getFingerprint(): string {
  try {
    const storage = getStorage();
    const existing = storage.getString(FINGERPRINT_KEY);
    if (existing) return existing;
    const fp = generateUUID();
    storage.set(FINGERPRINT_KEY, fp);
    return fp;
  } catch {
    return generateUUID();
  }
}

// --- Axios instance ---
const apiClient = axios.create({
  baseURL: ENV.API_URL || 'https://api.example.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    const storage = getStorage();
    const token = storage.getString('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // storage not ready
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      logger.info('Request cancelled');
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data?.error?.message ?? error.message;

    logger.error('API Error', { status, message, url: error.config?.url });
    return Promise.reject(error);
  },
);

// --- Home Feed (For You / Agents tabs) ---
interface HomeFeedParams {
  repos: string[];
  tab: string;
  type?: FilterType;
  lang?: string;
}

async function fetchHomeFeed(
  params: HomeFeedParams,
  page: number,
  signal?: AbortSignal,
): Promise<HomeFeedResponse> {
  const { data } = await apiClient.post<HomeFeedResponse>(
    '/api/home-feed',
    {
      repos: params.repos,
      page,
      per_page: 10,
      type: params.type ?? 'all',
      lang: params.lang ?? 'en',
      tab: params.tab,
    },
    { signal },
  );
  return data;
}

export function useHomeFeed(params: HomeFeedParams) {
  return useInfiniteQuery({
    queryKey: ['home-feed', params.tab, params.type ?? 'all', params.repos],
    queryFn: async ({ pageParam = 1, signal }) => {
      return fetchHomeFeed(params, pageParam, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.data.pagination.has_next) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    enabled: params.repos.length > 0,
    staleTime: 30_000,
    select: (data) => {
      const events: HomeFeedEvent[] = data.pages.flatMap((p) => p.data.events);
      return {
        events,
        hasNext: data.pages[data.pages.length - 1]?.data.pagination.has_next ?? false,
      };
    },
  });
}

// --- Community Posts ---
interface PostsParams {
  author?: string;
  repo?: string;
}

interface PostsCursor {
  cursor: string | null;
  cursorId: string | null;
}

async function fetchPosts(
  params: PostsParams,
  cursor?: string,
  cursorId?: string,
  signal?: AbortSignal,
): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();
  if (params.author) searchParams.set('author', params.author);
  if (params.repo) searchParams.set('repo', params.repo);
  if (cursor) searchParams.set('cursor', cursor);
  if (cursorId) searchParams.set('cursor_id', cursorId);

  const { data } = await apiClient.get<PostsResponse>(
    `/api/posts?${searchParams.toString()}`,
    { signal },
  );
  return data;
}

export function usePosts(params: PostsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['posts', params.author, params.repo],
    queryFn: async ({ pageParam, signal }) => {
      const { cursor, cursorId } = (pageParam ?? { cursor: null, cursorId: null }) as PostsCursor;
      return fetchPosts(
        params,
        cursor ?? undefined,
        cursorId ?? undefined,
        signal,
      );
    },
    initialPageParam: null as PostsCursor | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.has_more) {
        return {
          cursor: lastPage.data.pagination.next_cursor,
          cursorId: lastPage.data.pagination.next_cursor_id,
        };
      }
      return undefined;
    },
    staleTime: 30_000,
    select: (data) => {
      const posts: CommunityPost[] = data.pages.flatMap((p) => p.data.posts);
      return {
        posts,
        hasMore: data.pages[data.pages.length - 1]?.data.pagination.has_more ?? false,
      };
    },
  });
}

// --- Like Post ---

interface LikePostResponse {
  data: {
    count: number;
    action: 'liked' | 'unliked';
  };
}

interface LikePostVariables {
  postId: string;
}

interface LikePostResult {
  postId: string;
  count: number;
  action: 'liked' | 'unliked';
}

type PostsSnapshot = [readonly unknown[], InfiniteData<PostsResponse> | undefined][];

function patchPost(
  old: InfiniteData<PostsResponse> | undefined,
  postId: string,
  patch: (post: CommunityPost) => CommunityPost,
): InfiniteData<PostsResponse> | undefined {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      data: {
        ...page.data,
        posts: page.data.posts.map((p) => (p.id === postId ? patch(p) : p)),
      },
    })),
  };
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation<LikePostResult, Error, LikePostVariables, { snapshot: PostsSnapshot }>({
    mutationFn: async ({ postId }) => {
      const fp = getFingerprint();
      const { data } = await apiClient.post<LikePostResponse>(`/api/posts/${postId}/like`, {
        fingerprint: fp,
      });
      return { postId, ...data.data };
    },

    onMutate: async ({ postId }) => {
      // Cancel any in-flight fetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot all matching query caches for rollback
      const snapshot = queryClient.getQueriesData<InfiniteData<PostsResponse>>({
        queryKey: ['posts'],
      });

      // Optimistically toggle liked + like_count
      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ['posts'] },
        (old) =>
          patchPost(old, postId, (post) => ({
            ...post,
            liked: !post.liked,
            like_count: post.liked ? post.like_count - 1 : post.like_count + 1,
          })),
      );

      return { snapshot };
    },

    onError: (err, _vars, context) => {
      // Roll back to the snapshot
      context?.snapshot.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      logger.error('Like post failed', { err });
    },

    onSuccess: ({ postId, count, action }) => {
      // Sync with exact server values (avoids a full refetch)
      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ['posts'] },
        (old) =>
          patchPost(old, postId, (post) => ({
            ...post,
            liked: action === 'liked',
            like_count: count,
          })),
      );
    },
  });
}
