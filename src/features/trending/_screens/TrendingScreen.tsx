import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

export const TrendingScreen = () => {
  return (
    <Box bg="primary" className="flex-1 items-center justify-center gap-12">
      <Ionicons name="flame" size={48} color="#A1A1A1" />
      <Text variant="heading" size="sm" color="primary">Trending</Text>
      <Text variant="body" size="sm" color="secondary">Coming soon</Text>
    </Box>
  );
};
