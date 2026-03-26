import * as Keychain from 'react-native-keychain';
import * as Crypto from 'expo-crypto';
import { createLogger } from '@/utils/logger';

/**
 * Encryption Key Manager
 */

const logger = createLogger('Encryption');

const KEYCHAIN_SERVICE = 'com.example.myapp.encryption';
const KEYCHAIN_USERNAME = 'app-encryption-key';

/**
 * Generate a secure 32-byte encryption key
 */
const generateEncryptionKey = async (): Promise<string> => {
  // Generate 32 random bytes
  const randomBytes = await Crypto.getRandomBytesAsync(32);

  // Convert to hex string (64 characters)
  const hexKey = Array.from(randomBytes)
    .map((byte: number) => byte.toString(16).padStart(2, '0'))
    .join('');

  return hexKey;
};

/**
 * Store encryption key in secure storage
 */
const storeEncryptionKey = async (key: string): Promise<void> => {
  try {
    // Try with hardware-backed security first (iOS, newer Android devices)
    await Keychain.setGenericPassword(KEYCHAIN_USERNAME, key, {
      service: KEYCHAIN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
    });
    logger.info('Key stored with SECURE_HARDWARE');
  } catch (error) {
    // Fallback to software-backed security (Android emulators, older devices)
    logger.info('SECURE_HARDWARE not available, falling back to SECURE_SOFTWARE');
    await Keychain.setGenericPassword(KEYCHAIN_USERNAME, key, {
      service: KEYCHAIN_SERVICE,
      accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
      securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
    });
    logger.info('Key stored with SECURE_SOFTWARE');
  }
};

/**
 * Retrieve encryption key from secure storage
 */
const retrieveEncryptionKey = async (): Promise<string | null> => {
  const credentials = await Keychain.getGenericPassword({
    service: KEYCHAIN_SERVICE,
  });

  return credentials ? credentials.password : null;
};

/**
 * Get or create encryption key
 *
 * - If key exists in keychain, return it
 * - If not, generate new key, store it, and return it
 *
 * @returns 32-byte encryption key as hex string
 */
export const getOrCreateEncryptionKey = async (): Promise<string> => {
  try {
    // Try to retrieve existing key
    const existingKey = await retrieveEncryptionKey();

    if (existingKey) {
      logger.info('Using existing encryption key from keychain');
      return existingKey;
    }

    // Generate new key
    logger.info('Generating new encryption key');
    const newKey = await generateEncryptionKey();

    // Store in keychain
    await storeEncryptionKey(newKey);
    logger.info('Encryption key stored in keychain');

    return newKey;
  } catch (error) {
    logger.error('Failed to get/create encryption key', error);
    throw new Error('Failed to initialize encryption key');
  }
};

/**
 * Delete encryption key from keychain
 * WARNING: This will make existing encrypted MMKV data unreadable
 */
export const deleteEncryptionKey = async (): Promise<void> => {
  await Keychain.resetGenericPassword({
    service: KEYCHAIN_SERVICE,
  });
  logger.info('Encryption key deleted from keychain');
};

/**
 * Check if encryption key exists in keychain
 */
export const hasEncryptionKey = async (): Promise<boolean> => {
  const key = await retrieveEncryptionKey();
  return key !== null;
};
