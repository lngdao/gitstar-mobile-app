import { useState, useCallback, useMemo } from 'react';
import { FlatList, View, ActivityIndicator, RefreshControl } from 'react-native';
import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { HomeTabBar } from '@/features/home/_components/HomeTabBar';
import { FeedCard } from '@/features/home/_components/FeedCard';
import { PostCard } from '@/features/home/_components/PostCard';
import { FeedSkeletonList } from '@/features/home/_components/FeedSkeleton';
import { McpContent } from '@/features/home/_components/McpContent';
import { useHomeFeed, usePosts } from '@/features/home/_queries';
import type { HomeTabKey, HomeFeedEvent, CommunityPost } from '@/features/home/_types';

// Default repos for each tab (replace with user's starred repos when auth is ready)
const FOR_YOU_REPOS = [
  'facebook/react',
  'vercel/next.js',
  'sveltejs/svelte',
  'vuejs/core',
  'withastro/astro',
];


export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<HomeTabKey>('community');

  const handleTabChange = useCallback((tab: HomeTabKey) => {
    setActiveTab(tab);
  }, []);

  return (
    <Box bg="primary" className="flex-1">
      {/* Navigation header */}
      <Box
        className="flex-row items-center justify-between"
        style={{ paddingHorizontal: 16, paddingBottom: 8, paddingTop: insets.top + 8 }}
      >
        <Box className="flex-row items-center" style={{ gap: 6 }}>
          <Ionicons name="star" size={18} color="#B6573A" />
          <Text variant="heading" size="sm" color="primary">
            Gitstar
          </Text>
        </Box>
        <TouchableOpacity activeOpacity={0.6}>
          <Ionicons name="search" size={20} color="#FAFAFA" />
        </TouchableOpacity>
      </Box>

      {/* Sub-tab bar */}
      <HomeTabBar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Feed content per tab */}
      {activeTab === 'community' ? (
        <CommunityFeed />
      ) : activeTab === 'forYou' ? (
        <EventFeed repos={FOR_YOU_REPOS} tab="for-you" />
      ) : (
        <McpContent />
      )}
    </Box>
  );
};

// --- Community Feed (Posts) ---

const CommunityFeed = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } = usePosts();

  const posts = data?.posts ?? [];

  const renderPost = useCallback(({ item }: { item: CommunityPost }) => (
    <PostCard post={item} />
  ), []);

  const keyExtractor = useCallback((item: CommunityPost) => item.id, []);

  if (isLoading) {
    return <FeedSkeletonList />;
  }

  if (isError) {
    return (
      <EmptyMessage
        icon="alert-circle-outline"
        title="Failed to load posts"
        subtitle="Pull to refresh and try again"
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyMessage
        icon="chatbubble-ellipses-outline"
        title="No posts yet"
        subtitle="Be the first to share something with the community"
      />
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={keyExtractor}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={refetch}
          tintColor="#A1A1A1"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#A1A1A1" />
          </View>
        ) : !hasNextPage && posts.length > 0 ? (
          <EndOfFeedMessage />
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

// --- Event Feed (For You / Agents) ---

interface EventFeedProps {
  repos: string[];
  tab: string;
}

const EventFeed = ({ repos, tab }: EventFeedProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, isRefetching } = useHomeFeed({
    repos,
    tab,
    type: 'all',
  });

  const events = data?.events ?? [];

  const renderEvent = useCallback(({ item }: { item: HomeFeedEvent }) => (
    <FeedCard event={item} />
  ), []);

  const keyExtractor = useCallback((item: HomeFeedEvent) => item.id, []);

  if (isLoading) {
    return <FeedSkeletonList />;
  }

  if (isError) {
    return (
      <EmptyMessage
        icon="alert-circle-outline"
        title="Failed to load feed"
        subtitle="Pull to refresh and try again"
      />
    );
  }

  if (events.length === 0) {
    return (
      <EmptyMessage
        icon="telescope-outline"
        title="No events yet"
        subtitle="Star some repos to see their activity here"
      />
    );
  }

  return (
    <FlatList
      data={events}
      renderItem={renderEvent}
      keyExtractor={keyExtractor}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching && !isFetchingNextPage}
          onRefresh={refetch}
          tintColor="#A1A1A1"
        />
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#A1A1A1" />
          </View>
        ) : !hasNextPage && events.length > 0 ? (
          <EndOfFeedMessage />
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

// --- Shared UI ---

interface EmptyMessageProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

const EmptyMessage = ({ icon, title, subtitle }: EmptyMessageProps) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 80 }}>
    <Ionicons name={icon} size={48} color="#525252" />
    <Text variant="label" size="md" color="primary" style={{ marginTop: 16 }}>
      {title}
    </Text>
    <Text variant="body" size="sm" color="secondary" className="text-center" style={{ marginTop: 8 }}>
      {subtitle}
    </Text>
  </View>
);

const EndOfFeedMessage = () => (
  <Text
    variant="body"
    size="xs"
    color="secondary"
    className="text-center"
    style={{ paddingVertical: 32 }}
  >
    You've reached the end
  </Text>
);
