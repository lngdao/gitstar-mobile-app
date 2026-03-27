import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

function formatCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }
  return `${n}`;
}

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  onPress?: () => void;
}

export const ActionButton = ({ icon, count, onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
    >
      <Ionicons name={icon} size={15} color="#A1A1A1" />
      <Text variant="body" size="xs" color="secondary">
        {formatCount(count)}
      </Text>
    </TouchableOpacity>
  );
};
