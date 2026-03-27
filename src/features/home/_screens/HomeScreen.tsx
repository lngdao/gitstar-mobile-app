import { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import { HomeTabBar } from '@/features/home/_components/HomeTabBar';
import { FeedCard } from '@/features/home/_components/FeedCard';
import { FEED_BY_TAB } from '@/features/home/_data/mock-feed';
import type { HomeTabKey } from '@/features/home/_types';

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<HomeTabKey>('community');

  const currentFeed = FEED_BY_TAB[activeTab];

  const handleTabChange = useCallback((tab: HomeTabKey) => {
    setActiveTab(tab);
  }, []);

  return (
    <Box bg="primary" className="flex-1">
      {/* Navigation header */}
      <Box
        className="flex-row items-center justify-between px-16 pb-8"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Box className="flex-row items-center gap-6">
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

      {/* Feed */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentFeed.map((event) => (
          <FeedCard key={event.id} event={event} />
        ))}

        <Text
          variant="body"
          size="xs"
          color="secondary"
          className="text-center py-32"
        >
          You've reached the end
        </Text>
      </ScrollView>
    </Box>
  );
};
