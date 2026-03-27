import { Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

interface RepoBadgeProps {
  owner: string;
  name: string;
}

export const RepoBadge = ({ owner, name }: RepoBadgeProps) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: 'rgba(182, 87, 58, 0.07)', borderRadius: 4 }}>
      <Ionicons name="folder" size={10} color="#B6573A" />
      <Text variant="body" size="xs" color="secondary">
        {owner}/{name}
      </Text>
    </View>
  );
};
