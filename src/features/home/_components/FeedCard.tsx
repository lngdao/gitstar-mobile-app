import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import type { HomeFeedEvent } from '@/features/home/_types';
import { Avatar } from './Avatar';
import { RepoBadge } from './RepoBadge';
import { EventTypeBadge } from './EventTypeBadge';
import { ActionButton } from './ActionButton';
import { formatTimeAgo } from '@/features/home/_utils/time';

interface FeedCardProps {
  event: HomeFeedEvent;
}

export const FeedCard = ({ event }: FeedCardProps) => {
  const narrationText = event.narration?.body || event.body || '';

  return (
    <View>
      {/* Author row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14 }}>
        <Avatar login={event.author.login} avatarUrl={event.author.avatar_url} />

        <View style={{ marginLeft: 8, flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="label" size="sm" color="primary">
              {event.author.login}
            </Text>
            <Text variant="body" size="xs" color="secondary">
              {formatTimeAgo(event.event_created_at)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <RepoBadge owner={event.repo_owner} name={event.repo_name} />
          </View>
        </View>

        <EventTypeBadge type={event.type} />
      </View>

      {/* Content */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 }}>
        <Text variant="label" size="sm" color="primary" numberOfLines={2}>
          {event.title}
        </Text>
        {narrationText.length > 0 && (
          <Text variant="body" size="sm" color="secondary" numberOfLines={3} style={{ marginTop: 6 }}>
            {narrationText}
          </Text>
        )}

        {/* Code stats */}
        {(event.additions > 0 || event.deletions > 0) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <Text style={{ fontSize: 11, color: '#22C55E' }}>
              +{event.additions}
            </Text>
            <Text style={{ fontSize: 11, color: '#EF4444' }}>
              -{event.deletions}
            </Text>
            {event.files_changed > 0 && (
              <Text variant="body" size="xs" color="secondary">
                {event.files_changed} files
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Action bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 }}>
        <ActionButton icon="heart-outline" count={0} />
        <View style={{ marginLeft: 24 }}>
          <ActionButton icon="chatbubble-outline" count={event.comments ?? 0} />
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
