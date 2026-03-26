import { dayjs } from '@/libs/date';
import { createLogger } from '@/utils/logger';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import vi from './locales/vi';

const logger = createLogger('i18n');

const resources = {
  en: { translation: en },
  vi: { translation: vi },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export const initializeI18n = async (storageHelpers: any, STORAGE_KEYS: any) => {
  try {
    const savedLanguage = storageHelpers.getString(STORAGE_KEYS.LANGUAGE);
    if (savedLanguage && savedLanguage !== i18n.language) {
      await i18n.changeLanguage(savedLanguage);
      dayjs.locale(savedLanguage);
      logger.info('Loaded saved language', { language: savedLanguage });
    } else {
      dayjs.locale(i18n.language);
    }
  } catch (error) {
    logger.error('Failed to load saved language', error);
  }
};

i18n.on('languageChanged', (lng) => {
  dayjs.locale(lng);
  try {
    const { storageHelpers, STORAGE_KEYS } = require('@/libs/storage');
    storageHelpers.setString(STORAGE_KEYS.LANGUAGE, lng);
  } catch {
    logger.warn('Storage not available, language not persisted');
  }
});

export default i18n;

// Type-safe translation keys
export type TranslationKeys = typeof en;
export type TranslationKey = RecursiveKeyOf<TranslationKeys>;

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`;
}[keyof TObj & string];
