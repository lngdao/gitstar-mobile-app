import { ConfigContext, ExpoConfig } from 'expo/config';
import 'tsx/cjs';

// EAS Project Configuration
const EAS_PROJECT_ID = 'your-eas-project-id';
const PROJECT_SLUG = 'expo-boilerplate';

// App Production Config
const APP_NAME = 'GitStar - Top Repositories';
const BUNDLE_IDENTIFIER = 'com.gitstar';
const PACKAGE_NAME = 'com.gitstar';
const ICON = './assets/images/icon.png';
const ADAPTIVE_ICON = './assets/images/icon.png';
const SCHEME = 'gitstar';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = (process.env.APP_VARIANT || 'development') as
    | 'development'
    | 'preview'
    | 'production';
  console.log('Building app for environment:', appEnv);

  const { name, bundleIdentifier, packageName, icon, adaptiveIcon, scheme, channel } =
    getDynamicAppConfig(appEnv);

  return {
    ...config,
    name,
    // version is managed by withVersioning plugin based on APP_PHASE
    slug: PROJECT_SLUG,
    scheme,
    orientation: 'portrait',
    icon,
    userInterfaceStyle: 'automatic',
    backgroundColor: '#000000',
    runtimeVersion: {
      policy: 'nativeVersion',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier,
    },
    android: {
      icon,
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: '#ffffff',
      },
      package: packageName,
    },
    web: {
      favicon: './assets/images/favicon.png',
    },
    extra: {
      eas: {
        projectId: EAS_PROJECT_ID,
      },
      appVariant: appEnv,
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      ENABLE_DEBUG: process.env.EXPO_PUBLIC_ENABLE_DEBUG === 'true',
    },
    plugins: [
      'expo-router',
      'expo-localization',
      './app.plugin.js',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#040404',
          image: './assets/images/logo.png',
          imageWidth: 170,
        },
      ],
      'expo-web-browser',
      'expo-secure-store',
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};

/**
 * Dynamically configure the app based on the environment
 * @param environment - The build environment (development | preview | production)
 * @returns Dynamic app configuration values
 */
export const getDynamicAppConfig = (environment: 'development' | 'preview' | 'production') => {
  if (environment === 'production') {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
      channel: 'production',
    };
  }

  if (environment === 'preview') {
    return {
      name: `${APP_NAME} (Preview)`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: `${SCHEME}-preview`,
      channel: 'preview',
    };
  }

  return {
    name: `${APP_NAME} (Dev)`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: ICON,
    adaptiveIcon: ADAPTIVE_ICON,
    scheme: `${SCHEME}-dev`,
    channel: 'development',
  };
};
