import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SplashOverlay } from '@/features/splash';

export default function IndexScreen() {
  const router = useRouter();
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setIsSplashVisible(false);
    router.replace('/(tabs)/home');
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: '#B6573A' }}>
      {isSplashVisible && <SplashOverlay onFinish={handleSplashFinish} />}
    </View>
  );
}
