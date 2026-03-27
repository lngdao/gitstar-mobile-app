import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import type { FeedEvent } from '@/features/home/_types';
import { Avatar } from './Avatar';
import { RepoBadge } from './RepoBadge';
import { EventTypeBadge } from './EventTypeBadge';
import { ActionButton } from './ActionButton';

interface FeedCardProps {
  event: FeedEvent;
}

export const FeedCard = ({ event }: FeedCardProps) => {
  return (
    <View>
      {/* Author row */}
      <Box className="flex-row items-center px-16 pt-14">
        <Avatar login={event.author.login} />

        <Box className="ml-8 flex-1">
          <Box className="flex-row items-center gap-4">
            <Text variant="label" size="sm" color="primary">
              {event.author.displayName}
            </Text>
            <Text variant="body" size="xs" color="secondary">
              @{event.author.login}
            </Text>
          </Box>
          <Box className="flex-row items-center gap-4 mt-2">
            <RepoBadge owner={event.repoOwner} name={event.repoName} />
            <Text variant="body" size="xs" color="secondary">·</Text>
            <Text variant="body" size="xs" color="secondary">{event.timeAgo}</Text>
          </Box>
        </Box>

        <EventTypeBadge type={event.type} />
      </Box>

      {/* Content */}
      <Box className="px-16 pt-10 pb-12">
        <Text variant="label" size="sm" color="primary" numberOfLines={2}>
          {event.title}
        </Text>
        {event.body.length > 0 && (
          <Text variant="body" size="sm" color="secondary" numberOfLines={3} className="mt-6">
            {event.body}
          </Text>
        )}
      </Box>

      {/* Action bar */}
      <Box className="flex-row items-center px-16 pb-14">
        <ActionButton icon="heart-outline" count={event.likeCount} />
        <Box className="ml-24">
          <ActionButton icon="chatbubble-outline" count={event.commentCount} />
        </Box>
        <Box className="flex-1" />
        <TouchableOpacity activeOpacity={0.6}>
          <Ionicons name="bookmark-outline" size={16} color="#A1A1A1" />
        </TouchableOpacity>
      </Box>

      {/* Divider */}
      <View className="ml-16 h-[0.5px] bg-border-primary" />
    </View>
  );
};
