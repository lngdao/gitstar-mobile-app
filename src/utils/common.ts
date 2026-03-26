import { Linking, Platform } from 'react-native';

/**
 * Color utilities
 */
export function rgba(hexColor: string, alpha: number = 1): string {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!hexRegex.test(hexColor)) {
    throw new Error('Invalid hex color format');
  }

  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * String utilities
 */
export function transformString(
  input: string,
  transformType: 'uppercase' | 'lowercase' | 'capitalize' | 'title',
): string {
  switch (transformType) {
    case 'uppercase':
      return input.toUpperCase();
    case 'lowercase':
      return input.toLowerCase();
    case 'capitalize':
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    case 'title':
      const words = input.split(' ');
      const newWords = [];
      const num = new RegExp(/^\d+$/);
      for (const item of words) {
        let word;
        if (item.length > 0 && !num.test(item.charAt(0))) {
          word = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        } else {
          word = item.toLowerCase();
        }
        newWords.push(word);
      }
      return newWords.join(' ');
    default:
      return input;
  }
}

export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Number utilities
 */
export function formatNumber(
  num: number,
  options?: { decimals?: number; locale?: string },
): string {
  const { decimals = 0, locale = 'en-US' } = options || {};
  return num.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(
  amount: number,
  options?: { currency?: string; locale?: string },
): string {
  const { currency = 'USD', locale = 'en-US' } = options || {};
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Array utilities
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

/**
 * Object utilities
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Async utilities
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  options?: { maxAttempts?: number; delayMs?: number },
): Promise<T> {
  const { maxAttempts = 3, delayMs = 1000 } = options || {};
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await delay(delayMs);
      }
    }
  }

  throw lastError!;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    // @ts-ignore
    timeoutId = setTimeout(() => {
      func(...args);
    }, waitMs);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

/**
 * Device & Platform utilities
 */
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

export function isWeb(): boolean {
  return Platform.OS === 'web';
}

/**
 * Linking utilities
 */
export async function openLinkInBrowser(url: string): Promise<void> {
  return Linking.canOpenURL(url).then((canOpen) => {
    if (canOpen) {
      return Linking.openURL(url);
    }
    throw new Error(`Cannot open URL: ${url}`);
  });
}

export function openEmail(email: string, options?: { subject?: string; body?: string }): void {
  const { subject = '', body = '' } = options || {};
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  Linking.openURL(url);
}

export function openPhone(phoneNumber: string): void {
  Linking.openURL(`tel:${phoneNumber}`);
}

export function openSMS(phoneNumber: string, body?: string): void {
  const url = body ? `sms:${phoneNumber}?body=${encodeURIComponent(body)}` : `sms:${phoneNumber}`;
  Linking.openURL(url);
}

/**
 * Validation utilities
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
}

export const getAvatarLink = (text: string) =>
  `https://api.dicebear.com/9.x/dylan/svg?seed=${text}&mood=happy`;

export const recallFunction = (
  fn: () => void,
  times: number, /// how many times to recall the function
  delay: number, /// in seconds
) => {
  const loopTimes = Array.from({ length: times }, (_, i) => (i + 1) * delay);
  loopTimes.forEach((time) => {
    setTimeout(() => {
      fn();
    }, time * 1000);
  });
};
