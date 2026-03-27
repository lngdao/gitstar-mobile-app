import { Text } from '@/shared/components';
import { Image as ExpoImage } from 'expo-image';
import { View } from 'react-native';

const AVATAR_COLORS = ['#3B82F6', '#8B5CF6', '#22C55E', '#F97316', '#EC4899', '#14B8A6', '#6366F1'];

function getAvatarColor(login: string): string {
  let hash = 0;
  for (let i = 0; i < login.length; i++) {
    hash = login.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

interface AvatarProps {
  login: string;
  avatarUrl?: string | null;
  size?: number;
}

export const Avatar = ({ login, avatarUrl, size = 38 }: AvatarProps) => {
  const backgroundColor = getAvatarColor(login);
  const initial = login.charAt(0).toUpperCase();
  const fontSize = size * 0.4;

  if (avatarUrl) {
    return (
      <ExpoImage
        source={{ uri: avatarUrl }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{ fontSize, lineHeight: fontSize * 1.2 }}
        className="font-inter-bold text-white"
      >
        {initial}
      </Text>
    </View>
  );
};
