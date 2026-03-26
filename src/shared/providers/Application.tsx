import { useNetworkStore } from '@/stores';
import { Toaster, toastRef } from '@/shared/components/toast';
import { createLogger } from '@/utils/logger';
import * as Network from 'expo-network';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppInitializer } from '@/shared/providers/AppInitializer';
import { ReactQueryProvider } from '@/shared/providers/ReactQueryProvider';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';

const logger = createLogger('Application');

interface ApplicationProps {
  children: React.ReactNode;
}

/**
 * Application - Main app provider orchestrator
 */
export const Application: React.FC<ApplicationProps> = ({ children }) => {
  const setNetworkState = useNetworkStore((state) => state.setState);

  // Global network subscription
  useEffect(() => {
    Network.getNetworkStateAsync().then(setNetworkState);

    const subscription = Network.addNetworkStateListener((state) => {
      logger.debug('Network state updated', state);
      setNetworkState(state);
    });

    return () => {
      subscription.remove();
    };
  }, [setNetworkState]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppInitializer>
          <ThemeProvider>
            <ReactQueryProvider>
              {children}
              <Toaster ref={toastRef} position="center" />
            </ReactQueryProvider>
          </ThemeProvider>
        </AppInitializer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
