import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

export const BookmarksScreen = () => {
  return (
    <Box bg="primary" className="flex-1 items-center justify-center gap-12">
      <Ionicons name="bookmark" size={48} color="#A1A1A1" />
      <Text variant="heading" size="sm" color="primary">No bookmarks yet</Text>
      <Text variant="body" size="sm" color="secondary">Save posts to read later</Text>
    </Box>
  );
};
