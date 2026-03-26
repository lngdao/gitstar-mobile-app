import { Box, Text } from '@/shared/components';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => { router.replace('/(tabs)/home'); }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box bg="primary" className="flex-1 items-center justify-center">
      <Text variant="heading" color="primary">Welcome</Text>
    </Box>
  );
}
