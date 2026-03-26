export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
];

export const getLanguageByCode = (code: string) => LANGUAGES.find((l) => l.code === code);
export const getLanguageName = (code: string) => getLanguageByCode(code)?.nativeName || code;
