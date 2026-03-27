import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import type { EventType } from '@/features/home/_types';

const EVENT_CONFIG: Record<EventType, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  issue: { icon: 'alert-circle', color: '#22C55E', label: 'Issue' },
  pull_request: { icon: 'git-branch', color: '#8B5CF6', label: 'PR' },
  commit: { icon: 'checkmark-circle', color: '#3B82F6', label: 'Commit' },
  release: { icon: 'pricetag', color: '#F97316', label: 'Release' },
};

interface EventTypeBadgeProps {
  type: EventType;
}

export const EventTypeBadge = ({ type }: EventTypeBadgeProps) => {
  const config = EVENT_CONFIG[type] ?? { icon: 'code-slash' as keyof typeof Ionicons.glyphMap, color: '#A1A1A1', label: type };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        backgroundColor: config.color + '1A',
        borderRadius: 5,
      }}
    >
      <Ionicons name={config.icon} size={10} color={config.color} />
      <Text style={{ color: config.color, fontSize: 11, fontWeight: '500' }}>
        {config.label}
      </Text>
    </View>
  );
};
