import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

interface RepoBadgeProps {
  owner: string;
  name: string;
}

export const RepoBadge = ({ owner, name }: RepoBadgeProps) => {
  return (
    <Box className="flex-row items-center gap-3 rounded-xs px-6 py-2 bg-bg-brand/5">
      <Ionicons name="folder" size={10} color="#B6573A" />
      <Text variant="body" size="xs" color="secondary">
        {owner}/{name}
      </Text>
    </Box>
  );
};
