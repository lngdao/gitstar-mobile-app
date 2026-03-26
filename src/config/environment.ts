import Constants from 'expo-constants';

function getEnv(key: string, fallback?: string): string | undefined {
  const keyWithoutPrefix = key.replace(/^EXPO_PUBLIC_/, '');
  if (Constants.expoConfig?.extra?.[keyWithoutPrefix]) {
    return Constants.expoConfig.extra[keyWithoutPrefix];
  }
  const envVar = process.env[key];
  if (envVar) return envVar;
  return fallback;
}

export const ENV = {
  get isDev() { return __DEV__; },
  get isProd() { return !__DEV__; },
  get app() {
    return {
      name: Constants.expoConfig?.name || 'App',
      version: Constants.expoConfig?.version || '1.0.0',
      bundleId: Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package,
    };
  },
  get API_URL(): string { return getEnv('EXPO_PUBLIC_API_URL', 'https://api.example.com') || ''; },
  get ENABLE_DEBUG(): boolean { return getEnv('EXPO_PUBLIC_ENABLE_DEBUG') === 'true'; },
  get APP_VARIANT(): string { return getEnv('APP_VARIANT', 'development') || 'development'; },
  get: getEnv,
} as const;

export default ENV;
