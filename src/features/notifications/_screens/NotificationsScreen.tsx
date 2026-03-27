import { Box, Text } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

export const NotificationsScreen = () => {
  return (
    <Box bg="primary" className="flex-1 items-center justify-center gap-12">
      <Ionicons name="notifications" size={48} color="#A1A1A1" />
      <Text variant="heading" size="sm" color="primary">No notifications</Text>
      <Text variant="body" size="sm" color="secondary">You're all caught up!</Text>
    </Box>
  );
};
