import { initializeStorage, STORAGE_KEYS, storageHelpers } from '@/libs/storage';
import { initializeI18n } from '@/shared/i18n';
import { useUIPreferencesStore } from '@/stores/useUIPreferencesStore';
import { createLogger } from '@/utils/logger';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';

const logger = createLogger('AppInitializer');

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * AppInitializer - Handles app initialization logic
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { setColorScheme } = useColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize secure storage first
        await initializeStorage();
        logger.info('Storage initialized');

        // Rehydrate Zustand persist stores after storage is ready
        await useUIPreferencesStore.persist.rehydrate();
        logger.info('Zustand stores rehydrated');

        // Initialize i18n with saved language from storage
        await initializeI18n(storageHelpers, STORAGE_KEYS);

        // Initialize theme from storage
        const savedTheme = storageHelpers.getString(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
        if (savedTheme) {
          setColorScheme(savedTheme);
        }
      } catch (error) {
        logger.error('Failed to initialize app config', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show nothing while initializing (could add splash screen here)
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};
