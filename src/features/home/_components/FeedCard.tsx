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
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 }}>
        <Avatar login={event.author.login} />

        <View style={{ marginLeft: 8, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="label" size="sm" color="primary">
              {event.author.displayName}
            </Text>
            <Text variant="body" size="xs" color="secondary">
              @{event.author.login}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <RepoBadge owner={event.repoOwner} name={event.repoName} />
            <Text variant="body" size="xs" color="secondary">·</Text>
            <Text variant="body" size="xs" color="secondary">{event.timeAgo}</Text>
          </View>
        </View>

        <EventTypeBadge type={event.type} />
      </View>

      {/* Content */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 }}>
        <Text variant="label" size="sm" color="primary" numberOfLines={2}>
          {event.title}
        </Text>
        {event.body.length > 0 && (
          <Text variant="body" size="sm" color="secondary" numberOfLines={3} style={{ marginTop: 6 }}>
            {event.body}
          </Text>
        )}
      </View>

      {/* Action bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 }}>
        <ActionButton icon="heart-outline" count={event.likeCount} />
        <View style={{ marginLeft: 24 }}>
          <ActionButton icon="chatbubble-outline" count={event.commentCount} />
        </View>
        <View style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={0.6}>
          <Ionicons name="bookmark-outline" size={16} color="#A1A1A1" />
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={{ marginLeft: 16, height: 0.5 }} className="bg-border-primary" />
    </View>
  );
};
