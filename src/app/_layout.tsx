import { Application } from '@/shared/providers';
import { downloadUpdate } from '@/utils/updates';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform, BackHandler } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { Toast } from '@/shared/components';
import { useTranslation } from '@/shared/hooks';

import '../../global.css';
import '@/shared/i18n';

export default function RootLayout() {
  const { t } = useTranslation();

  useFonts({
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.otf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.otf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.otf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.otf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.otf'),
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#000000');
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('inset-swipe');
    }
    downloadUpdate().catch(() => {});
  }, []);

  const backPressCountRef = useRef(0);
  const backPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressCountRef.current === 0) {
        backPressCountRef.current = 1;
        Toast.show({ message: t('common.pressBackAgainToExit'), type: 'info', duration: 2000 });
        if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
        backPressTimerRef.current = setTimeout(() => { backPressCountRef.current = 0; }, 2000);
        return true;
      } else {
        if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
        BackHandler.exitApp();
        return true;
      }
    });
    return () => {
      backHandler.remove();
      if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
    };
  }, [t]);

  return (
    <Application>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade' }} />
      </Stack>
    </Application>
  );
}
