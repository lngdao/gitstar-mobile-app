import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { TranslationKey } from '@/shared/i18n';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();

  // Type-safe translation function
  const t = (key: TranslationKey, options?: any): string => {
    return originalT(key, options) as string;
  };

  return {
    t,
    i18n,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};
