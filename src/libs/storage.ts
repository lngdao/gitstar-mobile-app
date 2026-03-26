import { createLogger } from '@/utils/logger';
import { MMKV } from 'react-native-mmkv';
import { getOrCreateEncryptionKey } from '@/libs/encryption';

/**
 * MMKV Storage Wrapper with Secure Encryption
 *
 * Uses 32-byte encryption key stored in iOS Keychain / Android Keystore
 */

const logger = createLogger('Storage');

let storageInstance: MMKV | null = null;

/**
 * Initialize MMKV storage with secure encryption key
 * Must be called before using storage (in Application component)
 */
export const initializeStorage = async (): Promise<void> => {
  if (storageInstance) {
    logger.info('Already initialized');
    return;
  }

  try {
    // Get or create encryption key from keychain
    const encryptionKey = await getOrCreateEncryptionKey();

    // Initialize MMKV with encryption
    storageInstance = new MMKV({
      id: 'app-storage',
      encryptionKey,
    });

    logger.info('MMKV initialized with secure encryption');
  } catch (error) {
    logger.error('Failed to initialize MMKV', error);
    throw error;
  }
};

/**
 * Get storage instance
 * Throws error if storage not initialized
 */
export const getStorage = (): MMKV => {
  if (!storageInstance) {
    throw new Error(
      'Storage not initialized. Call initializeStorage() first in Application component.',
    );
  }
  return storageInstance;
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  LANGUAGE: 'app.language',
  THEME: 'app.theme',
  TOKEN: 'app.token',
  REFRESH_TOKEN: 'app.refreshToken',
} as const;

/**
 * Type-safe storage helpers
 */
export const storageHelpers = {
  // String
  setString: (key: string, value: string) => getStorage().set(key, value),
  getString: (key: string) => getStorage().getString(key),

  // Number
  setNumber: (key: string, value: number) => getStorage().set(key, value),
  getNumber: (key: string) => getStorage().getNumber(key),

  // Boolean
  setBoolean: (key: string, value: boolean) => getStorage().set(key, value),
  getBoolean: (key: string) => getStorage().getBoolean(key),

  // JSON (for objects/arrays)
  setJSON: <T>(key: string, value: T) => {
    getStorage().set(key, JSON.stringify(value));
  },
  getJSON: <T>(key: string): T | null => {
    const value = getStorage().getString(key);
    return value ? JSON.parse(value) : null;
  },

  // Delete
  delete: (key: string) => getStorage().delete(key),

  // Clear all
  clearAll: () => getStorage().clearAll(),

  // Check if key exists
  contains: (key: string) => getStorage().contains(key),

  // Get all keys
  getAllKeys: () => getStorage().getAllKeys(),
};
