import * as Updates from 'expo-updates';
import { createLogger } from '@/utils/logger';

const logger = createLogger('OTA');

/**
 * Check for available updates
 */
export const checkForUpdate = async () => {
  try {
    if (__DEV__ && !Updates.isEmbeddedLaunch) {
      return { isAvailable: false };
    }

    const update = await Updates.checkForUpdateAsync();

    logger.info('Update check result', {
      isAvailable: update.isAvailable,
      currentUpdateId: Updates.updateId,
    });

    return update;
  } catch (error) {
    logger.error('Error checking for update', error);
    return { isAvailable: false };
  }
};

/**
 * Download update in background
 * User will see the update on next app restart
 */
export const downloadUpdate = async () => {
  try {
    const update = await checkForUpdate();

    if (!update.isAvailable) {
      logger.info('No update available');
      return false;
    }

    logger.info('Downloading update...');
    await Updates.fetchUpdateAsync();
    logger.info('Update downloaded! Will apply on next restart');

    return true;
  } catch (error) {
    logger.error('Error downloading update', error);
    return false;
  }
};

/**
 * Get current update info
 */
export const getUpdateInfo = () => {
  return {
    updateId: Updates.updateId,
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
  };
};
