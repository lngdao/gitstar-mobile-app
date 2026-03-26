# Expo Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a simplified, production-ready Expo boilerplate from the Whales Market Mobile V2 codebase, keeping core architecture, configs, scripts, and patterns while removing all domain-specific code.

**Architecture:** Feature-based architecture with Expo Router, NativeWind/Tailwind for styling, Zustand+MMKV for state, React Query for data fetching, Ky for HTTP, i18n for translations. All domain-specific code (web3, crypto, privy, auth) removed. Theme system refactored for cleanliness.

**Tech Stack:** Expo 54, React Native 0.81.5, TypeScript 5.9, NativeWind 4.2, Zustand 5, React Query 5, Ky, i18next, MMKV, Reanimated 4

---

**IMPORTANT NOTES FOR IMPLEMENTER:**
- The source project is at `_ignore/whales-market-mobile-v2/` - reference it for exact code when needed
- All files go in `/Users/longdao/Projects/expo-boilerplate/`
- Use `@/` path alias for all imports (maps to `./src/*`)
- NEVER use `console.log` - use `createLogger` from `@/utils/logger`
- Port code from the source project, adapting as needed to remove domain-specific references
- The `_ignore/` directory should remain untouched

---

### Task 1: Root Config Files

**Files:**
- Create: `package.json`
- Create: `app.config.ts`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `metro.config.js`
- Create: `tailwind.config.js`
- Create: `global.css`
- Create: `entrypoint.js`
- Create: `app.plugin.js`
- Create: `eas.json`
- Create: `bunfig.toml`
- Create: `svg.d.ts`
- Create: `nativewind-env.d.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `Gemfile`

- [ ] **Step 1: Create `package.json`**

Simplified dependencies - remove all web3/crypto/privy/SSL/chart/camera packages. Keep core infrastructure.

```json
{
  "name": "expo-boilerplate",
  "version": "1.0.0",
  "main": "entrypoint.js",
  "scripts": {
    "start": "expo start",
    "dev": "APP_VARIANT=development expo start",
    "preview": "APP_VARIANT=preview expo start",
    "android": "expo run:android",
    "android:device": "expo run:android --device",
    "ios": "expo run:ios",
    "ios:device": "expo run:ios --device",
    "web": "expo start --web",
    "prebuild": "node scripts/prebuild.js",
    "prebuild:ios": "node scripts/prebuild.js --platform ios",
    "prebuild:android": "node scripts/prebuild.js --platform android",
    "build:apk:debug": "cd android && ./gradlew assembleDebug",
    "build:apk:release": "cd android && ./gradlew assembleRelease",
    "build:bundle:release": "cd android && ./gradlew bundleRelease",
    "update": "eas update --auto",
    "update:dev": "eas update --channel development --message \"Dev update\"",
    "update:preview": "eas update --channel preview --message \"Preview update\"",
    "update:prod": "eas update --channel production --message \"Production update\"",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "generate:assets": "bun scripts/generate-asset-resources.js",
    "generate:routes": "bun scripts/generate-routes.js",
    "generate:env": "bun scripts/generate-environment.js",
    "pod": "cd ios && pod install"
  },
  "dependencies": {
    "@d11/react-native-fast-image": "^8.13.0",
    "@expo-google-fonts/inter": "^0.4.2",
    "@react-navigation/bottom-tabs": "^7.8.4",
    "@react-navigation/native": "^7.1.19",
    "@tanstack/react-query": "^5.90.10",
    "clsx": "^2.1.1",
    "dayjs": "^1.11.19",
    "expo": "~54.0.22",
    "expo-application": "~7.0.7",
    "expo-clipboard": "^8.0.7",
    "expo-constants": "~18.0.10",
    "expo-crypto": "^15.0.7",
    "expo-dev-client": "~6.0.17",
    "expo-haptics": "~15.0.7",
    "expo-linear-gradient": "~15.0.7",
    "expo-linking": "~8.0.8",
    "expo-localization": "~17.0.7",
    "expo-navigation-bar": "^5.0.9",
    "expo-network": "^8.0.7",
    "expo-router": "~6.0.14",
    "expo-secure-store": "~15.0.7",
    "expo-splash-screen": "~31.0.10",
    "expo-status-bar": "~3.0.8",
    "expo-system-ui": "~6.0.8",
    "expo-updates": "^29.0.12",
    "expo-web-browser": "~15.0.9",
    "i18next": "^25.6.0",
    "immer": "^10.2.0",
    "ky": "^1.14.0",
    "nativewind": "4.2.1",
    "react": "19.1.0",
    "react-hook-form": "^7.66.0",
    "react-i18next": "^16.2.4",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-keyboard-controller": "1.18.5",
    "react-native-keychain": "^10.0.0",
    "react-native-mmkv": "~3.3.1",
    "react-native-reanimated": "4.1.0",
    "react-native-safe-area-context": "^5.6.2",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "tailwind-merge": "^3.3.1",
    "tailwind-variants": "^3.1.1",
    "zod": "^4.1.12",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "babel-preset-expo": "^54.0.6",
    "eslint": "^9.39.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-native": "^5.0.0",
    "prettier": "^3.6.2",
    "react-native-svg-transformer": "^1.5.1",
    "tailwindcss": "^3.4.4",
    "tsx": "^4.20.6",
    "typescript": "~5.9.2"
  },
  "private": true
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "Bundler"
  },
  "include": ["**/*.ts", "**/*.tsx", "nativewind-env.d.ts", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

- [ ] **Step 3: Create `babel.config.js`**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

- [ ] **Step 4: Create `metro.config.js`**

Simplified - no local modules, no web3 package exports.

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// SVG support
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  unstable_enablePackageExports: true,
  unstable_conditionNames: ['browser', 'require', 'react-native'],
};

module.exports = withNativeWind(config, { input: './global.css' });
```

- [ ] **Step 5: Create `app.config.ts`**

Port from source, remove Privy/web3/camera/Firebase references.

```ts
import { ConfigContext, ExpoConfig } from 'expo/config';
import 'tsx/cjs';

// EAS Project Configuration - UPDATE THESE FOR YOUR PROJECT
const EAS_PROJECT_ID = 'your-eas-project-id';
const PROJECT_SLUG = 'expo-boilerplate';

// App Production Config - UPDATE THESE FOR YOUR PROJECT
const APP_NAME = 'My App';
const BUNDLE_IDENTIFIER = 'com.example.myapp';
const PACKAGE_NAME = 'com.example.myapp';
const ICON = './assets/images/icon.png';
const ADAPTIVE_ICON = './assets/images/icon.png';
const SCHEME = 'myapp';

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
    slug: PROJECT_SLUG,
    scheme,
    orientation: 'portrait',
    icon,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    backgroundColor: '#000000',
    runtimeVersion: {
      policy: 'nativeVersion',
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
      enabled: true,
      requestHeaders: {
        'expo-channel-name': channel,
      },
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
      edgeToEdgeEnabled: true,
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
    ],
    experiments: {
      typedRoutes: true,
    },
  };
};

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
```

- [ ] **Step 6: Create `tailwind.config.js`**

Port from source. The theme tokens reference files that will be created in Task 3.

```js
/** @type {import('tailwindcss').Config} */

const { darkThemeVars } = require('./src/shared/theme/theme-dark.ts');
const { lightThemeVars } = require('./src/shared/theme/theme-light.ts');
const { colors } = require('./src/shared/theme/colors.ts');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Design Tokens (CSS Variables) - auto-switch light/dark
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--text-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--text-disabled) / <alpha-value>)',
          inverse: 'rgb(var(--text-inverse) / <alpha-value>)',
          'on-color': 'rgb(var(--text-on-color) / <alpha-value>)',
          success: 'rgb(var(--text-success) / <alpha-value>)',
          danger: 'rgb(var(--text-danger) / <alpha-value>)',
          warning: 'rgb(var(--text-warning) / <alpha-value>)',
          info: 'rgb(var(--text-info) / <alpha-value>)',
          brand: 'rgb(var(--text-brand) / <alpha-value>)',
        },
        bg: {
          primary: 'rgb(var(--bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--bg-tertiary) / <alpha-value>)',
          quaternary: 'rgb(var(--bg-quaternary) / <alpha-value>)',
          inverse: 'rgb(var(--bg-inverse) / <alpha-value>)',
          brand: 'rgb(var(--bg-brand) / <alpha-value>)',
          success: 'rgb(var(--bg-success) / <alpha-value>)',
          danger: 'rgb(var(--bg-danger) / <alpha-value>)',
          warning: 'rgb(var(--bg-warning) / <alpha-value>)',
          info: 'rgb(var(--bg-info) / <alpha-value>)',
          'brand-muted': 'rgb(var(--bg-brand-muted) / <alpha-value>)',
          'secondary-muted': 'rgb(var(--bg-secondary-muted) / <alpha-value>)',
          'success-muted': 'rgb(var(--bg-success-muted) / <alpha-value>)',
          'danger-muted': 'rgb(var(--bg-danger-muted) / <alpha-value>)',
          'warning-muted': 'rgb(var(--bg-warning-muted) / <alpha-value>)',
          'info-muted': 'rgb(var(--bg-info-muted) / <alpha-value>)',
          overlay: 'rgb(var(--bg-overlay) / <alpha-value>)',
        },
        border: {
          primary: 'rgb(var(--border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--border-tertiary) / <alpha-value>)',
          inverse: 'rgb(var(--border-inverse) / <alpha-value>)',
          brand: 'rgb(var(--border-brand) / <alpha-value>)',
          success: 'rgb(var(--border-success) / <alpha-value>)',
          danger: 'rgb(var(--border-danger) / <alpha-value>)',
          warning: 'rgb(var(--border-warning) / <alpha-value>)',
          info: 'rgb(var(--border-info) / <alpha-value>)',
        },
        icon: {
          primary: 'rgb(var(--icon-primary) / <alpha-value>)',
          secondary: 'rgb(var(--icon-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--icon-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--icon-disabled) / <alpha-value>)',
          inverse: 'rgb(var(--icon-inverse) / <alpha-value>)',
          'on-color': 'rgb(var(--icon-on-color) / <alpha-value>)',
          success: 'rgb(var(--icon-success) / <alpha-value>)',
          danger: 'rgb(var(--icon-danger) / <alpha-value>)',
          warning: 'rgb(var(--icon-warning) / <alpha-value>)',
          info: 'rgb(var(--icon-info) / <alpha-value>)',
          brand: 'rgb(var(--icon-brand) / <alpha-value>)',
        },
        button: {
          primary: 'rgb(var(--button-primary) / <alpha-value>)',
          'primary-hover': 'rgb(var(--button-primary-hover) / <alpha-value>)',
          'primary-active': 'rgb(var(--button-primary-active) / <alpha-value>)',
          secondary: 'rgb(var(--button-secondary) / <alpha-value>)',
          'secondary-hover': 'rgb(var(--button-secondary-hover) / <alpha-value>)',
          'secondary-active': 'rgb(var(--button-secondary-active) / <alpha-value>)',
          danger: 'rgb(var(--button-danger) / <alpha-value>)',
          'danger-hover': 'rgb(var(--button-danger-hover) / <alpha-value>)',
          'danger-active': 'rgb(var(--button-danger-active) / <alpha-value>)',
          disabled: 'rgb(var(--button-disabled) / <alpha-value>)',
        },

        // Base colors (static)
        white: colors.white,
        black: colors.black,
        transparent: colors.transparent,
        neutral: colors.neutral,
        primary: colors.primary,
        success: colors.success,
        danger: colors.danger,
        info: colors.info,
        warning: colors.warning,
      },
      spacing: {
        0: '0px', 2: '2px', 4: '4px', 6: '6px', 8: '8px',
        10: '10px', 12: '12px', 16: '16px', 20: '20px', 24: '24px',
        32: '32px', 40: '40px', 48: '48px', 52: '52px', 56: '56px', 64: '64px',
      },
      borderRadius: {
        none: '0px', xs: '2px', sm: '4px', md: '6px', lg: '8px',
        xl: '10px', '2xl': '12px', '3xl': '16px', full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.05)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.2)',
      },
      fontSize: {
        'display-lg': '57px', 'display-md': '45px', 'display-sm': '36px',
        'headline-lg': '32px', 'headline-md': '28px', 'headline-sm': '24px',
        'title-lg': '22px', 'title-md': '16px', 'title-sm': '14px',
        'body-lg': '16px', 'body-md': '14px', 'body-sm': '12px',
        'label-lg': '14px', 'label-md': '12px', 'label-sm': '11px',
      },
      fontFamily: {
        'inter-regular': ['Inter-Regular'],
        'inter-medium': ['Inter-Medium'],
        'inter-semibold': ['Inter-SemiBold'],
        'inter-bold': ['Inter-Bold'],
        'inter-extrabold': ['Inter-ExtraBold'],
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        ':root': lightThemeVars,
        '.dark': darkThemeVars,
      });
    },
  ],
};
```

- [ ] **Step 7: Create remaining root config files**

Create these files by porting from source (with simplifications):

**`global.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`entrypoint.js`** (simplified - no web3 polyfills):
```js
import 'expo-router/entry';
```

**`app.plugin.js`** (simplified - no Firebase):
```js
const { withVersioning, withCustomNativeConfig, withAndroidSvgFix, withOptimizeApkSize, withAndroidIconKeepRules } = require('./plugins');

module.exports = (config) => {
  config = withVersioning(config);
  config = withCustomNativeConfig(config);
  config = withAndroidSvgFix(config);
  config = withOptimizeApkSize(config);
  config = withAndroidIconKeepRules(config);
  return config;
};
```

**`eas.json`:**
```json
{
  "cli": { "version": ">= 13.2.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "env": { "APP_VARIANT": "development" }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "env": { "APP_VARIANT": "preview" }
    },
    "production": {
      "channel": "production",
      "env": { "APP_VARIANT": "production" }
    }
  },
  "submit": {
    "production": {}
  }
}
```

**`bunfig.toml`:**
```toml
[install.peer]
enable = true

[install]
exact = false
optional = true
cache = true
```

**`svg.d.ts`:**
```ts
declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
```

**`nativewind-env.d.ts`:**
```ts
/// <reference types="nativewind/types" />
```

**`.env.example`:**
```
# API Configuration
EXPO_PUBLIC_API_URL=https://api.example.com

# Feature Flags
EXPO_PUBLIC_ENABLE_DEBUG=false
```

**`.gitignore`:** Port from standard Expo `.gitignore` plus `_ignore/`, `.build-numbers.json`, `.phase`, `.env.local`.

**`Gemfile`:**
```ruby
source "https://rubygems.org"
gem "fastlane"
gem "cocoapods"
```

- [ ] **Step 8: Commit**

```bash
git init
git add -A
git commit -m "feat: add root config files for expo boilerplate"
```

---

### Task 2: Assets & Fonts

**Files:**
- Create: `assets/images/icon.png` (placeholder)
- Create: `assets/images/favicon.png` (placeholder)
- Create: `assets/images/logo.png` (placeholder)
- Create: `assets/icons/` (empty dir with .gitkeep)
- Create: `assets/fonts/Inter-Regular.otf`
- Create: `assets/fonts/Inter-Medium.otf`
- Create: `assets/fonts/Inter-SemiBold.otf`
- Create: `assets/fonts/Inter-Bold.otf`
- Create: `assets/fonts/Inter-ExtraBold.otf`

- [ ] **Step 1: Create asset directories and placeholders**

Copy the Inter font files from the source project. For images, create simple 1024x1024 placeholder PNGs (or copy icon/logo from source and replace branding later).

```bash
mkdir -p assets/images assets/icons assets/fonts
# Copy fonts from source
cp _ignore/whales-market-mobile-v2/assets/fonts/Inter-*.otf assets/fonts/
# Copy placeholder images from source (will be replaced later)
cp _ignore/whales-market-mobile-v2/assets/images/icon.png assets/images/
cp _ignore/whales-market-mobile-v2/assets/images/favicon.png assets/images/
cp _ignore/whales-market-mobile-v2/assets/images/logo.png assets/images/
# Keep icons dir
touch assets/icons/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add assets/
git commit -m "feat: add asset placeholders and Inter fonts"
```

---

### Task 3: Theme System

**Files:**
- Create: `src/shared/theme/colors.ts`
- Create: `src/shared/theme/helpers.ts`
- Create: `src/shared/theme/theme-dark.ts`
- Create: `src/shared/theme/theme-light.ts`
- Create: `src/shared/theme/fonts.ts`
- Create: `src/shared/theme/index.ts`

- [ ] **Step 1: Create `src/shared/theme/colors.ts`**

Port from source, remove social brand colors (domain-specific). Keep neutral, primary, semantic, overlay. Change primary to a generic blue brand color instead of lime green.

```ts
/**
 * Base Color Palette
 * Primitive colors used across the app.
 * For theme-aware semantic colors, see theme-dark.ts and theme-light.ts
 */

export const colors = {
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  neutral: {
    50: '#FAFAFA',
    100: '#F4F4F4',
    200: '#E4E4E4',
    300: '#D4D4D4',
    400: '#A1A1A1',
    500: '#717171',
    600: '#525252',
    700: '#272727',
    800: '#1C1C1C',
    900: '#121212',
    950: '#000000',
  },

  primary: {
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  success: {
    300: '#68D391',
    400: '#35DF8D',
    500: '#1EC977',
    600: '#15AF77',
    700: '#139B6B',
  },

  danger: {
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },

  info: {
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },

  warning: {
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
  },

  overlay: {
    dark: {
      50: '#00000080',
    },
    light: {
      50: '#FFFFFF80',
    },
  },
} as const;

export type ColorScale = typeof colors.neutral;
export type ColorShade = keyof ColorScale;
```

- [ ] **Step 2: Create `src/shared/theme/helpers.ts`**

Port exactly from source.

```ts
export function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  const fullHex =
    cleanHex.length === 3
      ? cleanHex.split('').map((char) => char + char).join('')
      : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return `${r} ${g} ${b}`;
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const alphaHex = Math.round((alpha / 100) * 255).toString(16).padStart(2, '0');
  return `${hex}${alphaHex}`;
}
```

- [ ] **Step 3: Create `src/shared/theme/theme-dark.ts`**

Port structure from source, update colors to use new primary (blue). Keep same pattern of semantic tokens + CSS variables.

```ts
import { colors } from './colors';
import { hexToRgb } from './helpers';

export const darkTheme = {
  text: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
    disabled: colors.neutral[600],
    inverse: colors.neutral[950],
    onColor: colors.white,
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
    brand: colors.primary[500],
  },
  bg: {
    primary: colors.neutral[950],
    secondary: colors.neutral[900],
    tertiary: colors.neutral[800],
    quaternary: colors.neutral[700],
    inverse: colors.white,
    brand: colors.primary[500],
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
    brandMuted: colors.primary[500] + '33',
    secondaryMuted: colors.neutral[500] + '29',
    successMuted: colors.success[500] + '33',
    dangerMuted: colors.danger[500] + '33',
    warningMuted: colors.warning[500] + '33',
    infoMuted: colors.info[500] + '33',
    overlay: colors.overlay.dark[50],
  },
  border: {
    primary: colors.neutral[800],
    secondary: colors.neutral[700],
    tertiary: colors.neutral[600],
    inverse: colors.neutral[200],
    brand: colors.primary[500],
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
  },
  icon: {
    primary: colors.neutral[50],
    secondary: colors.neutral[400],
    tertiary: colors.neutral[500],
    disabled: colors.neutral[600],
    inverse: colors.neutral[950],
    onColor: colors.white,
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
    brand: colors.primary[500],
  },
  button: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    secondary: colors.neutral[800],
    secondaryHover: colors.neutral[700],
    secondaryActive: colors.neutral[600],
    danger: colors.danger[500],
    dangerHover: colors.danger[600],
    dangerActive: colors.danger[700],
    disabled: colors.neutral[700],
  },
} as const;

// Generate CSS variables from theme object
function generateThemeVars(theme: typeof darkTheme) {
  return {
    '--text-primary': hexToRgb(theme.text.primary),
    '--text-secondary': hexToRgb(theme.text.secondary),
    '--text-tertiary': hexToRgb(theme.text.tertiary),
    '--text-disabled': hexToRgb(theme.text.disabled),
    '--text-inverse': hexToRgb(theme.text.inverse),
    '--text-on-color': hexToRgb(theme.text.onColor),
    '--text-success': hexToRgb(theme.text.success),
    '--text-danger': hexToRgb(theme.text.danger),
    '--text-warning': hexToRgb(theme.text.warning),
    '--text-info': hexToRgb(theme.text.info),
    '--text-brand': hexToRgb(theme.text.brand),
    '--bg-primary': hexToRgb(theme.bg.primary),
    '--bg-secondary': hexToRgb(theme.bg.secondary),
    '--bg-tertiary': hexToRgb(theme.bg.tertiary),
    '--bg-quaternary': hexToRgb(theme.bg.quaternary),
    '--bg-inverse': hexToRgb(theme.bg.inverse),
    '--bg-brand': hexToRgb(theme.bg.brand),
    '--bg-success': hexToRgb(theme.bg.success),
    '--bg-danger': hexToRgb(theme.bg.danger),
    '--bg-warning': hexToRgb(theme.bg.warning),
    '--bg-info': hexToRgb(theme.bg.info),
    '--bg-brand-muted': hexToRgb(colors.primary[500]),
    '--bg-secondary-muted': hexToRgb(colors.neutral[500]),
    '--bg-success-muted': hexToRgb(colors.success[500]),
    '--bg-danger-muted': hexToRgb(colors.danger[500]),
    '--bg-warning-muted': hexToRgb(colors.warning[500]),
    '--bg-info-muted': hexToRgb(colors.info[500]),
    '--bg-overlay': hexToRgb(colors.black),
    '--border-primary': hexToRgb(theme.border.primary),
    '--border-secondary': hexToRgb(theme.border.secondary),
    '--border-tertiary': hexToRgb(theme.border.tertiary),
    '--border-inverse': hexToRgb(theme.border.inverse),
    '--border-brand': hexToRgb(theme.border.brand),
    '--border-success': hexToRgb(theme.border.success),
    '--border-danger': hexToRgb(theme.border.danger),
    '--border-warning': hexToRgb(theme.border.warning),
    '--border-info': hexToRgb(theme.border.info),
    '--icon-primary': hexToRgb(theme.icon.primary),
    '--icon-secondary': hexToRgb(theme.icon.secondary),
    '--icon-tertiary': hexToRgb(theme.icon.tertiary),
    '--icon-disabled': hexToRgb(theme.icon.disabled),
    '--icon-inverse': hexToRgb(theme.icon.inverse),
    '--icon-on-color': hexToRgb(theme.icon.onColor),
    '--icon-success': hexToRgb(theme.icon.success),
    '--icon-danger': hexToRgb(theme.icon.danger),
    '--icon-warning': hexToRgb(theme.icon.warning),
    '--icon-info': hexToRgb(theme.icon.info),
    '--icon-brand': hexToRgb(theme.icon.brand),
    '--button-primary': hexToRgb(theme.button.primary),
    '--button-primary-hover': hexToRgb(theme.button.primaryHover),
    '--button-primary-active': hexToRgb(theme.button.primaryActive),
    '--button-secondary': hexToRgb(theme.button.secondary),
    '--button-secondary-hover': hexToRgb(theme.button.secondaryHover),
    '--button-secondary-active': hexToRgb(theme.button.secondaryActive),
    '--button-danger': hexToRgb(theme.button.danger),
    '--button-danger-hover': hexToRgb(theme.button.dangerHover),
    '--button-danger-active': hexToRgb(theme.button.dangerActive),
    '--button-disabled': hexToRgb(theme.button.disabled),
  } as const;
}

export const darkThemeVars = generateThemeVars(darkTheme);
export type DarkTheme = typeof darkTheme;
```

- [ ] **Step 4: Create `src/shared/theme/theme-light.ts`**

Same pattern as dark, with inverted values.

```ts
import { colors } from './colors';
import { hexToRgb } from './helpers';

export const lightTheme = {
  text: {
    primary: colors.neutral[950],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    disabled: colors.neutral[400],
    inverse: colors.neutral[50],
    onColor: colors.white,
    success: colors.success[600],
    danger: colors.danger[600],
    warning: colors.warning[600],
    info: colors.info[600],
    brand: colors.primary[600],
  },
  bg: {
    primary: colors.neutral[50],
    secondary: colors.neutral[100],
    tertiary: colors.neutral[200],
    quaternary: colors.neutral[300],
    inverse: colors.neutral[950],
    brand: colors.primary[500],
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
    brandMuted: colors.primary[500] + '33',
    secondaryMuted: colors.neutral[500] + '29',
    successMuted: colors.success[500] + '33',
    dangerMuted: colors.danger[500] + '33',
    warningMuted: colors.warning[500] + '33',
    infoMuted: colors.info[500] + '33',
    overlay: colors.overlay.light[50],
  },
  border: {
    primary: colors.neutral[200],
    secondary: colors.neutral[300],
    tertiary: colors.neutral[400],
    inverse: colors.neutral[800],
    brand: colors.primary[500],
    success: colors.success[500],
    danger: colors.danger[500],
    warning: colors.warning[500],
    info: colors.info[500],
  },
  icon: {
    primary: colors.neutral[950],
    secondary: colors.neutral[600],
    tertiary: colors.neutral[500],
    disabled: colors.neutral[400],
    inverse: colors.neutral[50],
    onColor: colors.white,
    success: colors.success[600],
    danger: colors.danger[600],
    warning: colors.warning[600],
    info: colors.info[600],
    brand: colors.primary[600],
  },
  button: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    primaryActive: colors.primary[700],
    secondary: colors.neutral[200],
    secondaryHover: colors.neutral[300],
    secondaryActive: colors.neutral[400],
    danger: colors.danger[500],
    dangerHover: colors.danger[600],
    dangerActive: colors.danger[700],
    disabled: colors.neutral[300],
  },
} as const;

// Reuse the same generateThemeVars pattern
function generateThemeVars(theme: typeof lightTheme) {
  return {
    '--text-primary': hexToRgb(theme.text.primary),
    '--text-secondary': hexToRgb(theme.text.secondary),
    '--text-tertiary': hexToRgb(theme.text.tertiary),
    '--text-disabled': hexToRgb(theme.text.disabled),
    '--text-inverse': hexToRgb(theme.text.inverse),
    '--text-on-color': hexToRgb(theme.text.onColor),
    '--text-success': hexToRgb(theme.text.success),
    '--text-danger': hexToRgb(theme.text.danger),
    '--text-warning': hexToRgb(theme.text.warning),
    '--text-info': hexToRgb(theme.text.info),
    '--text-brand': hexToRgb(theme.text.brand),
    '--bg-primary': hexToRgb(theme.bg.primary),
    '--bg-secondary': hexToRgb(theme.bg.secondary),
    '--bg-tertiary': hexToRgb(theme.bg.tertiary),
    '--bg-quaternary': hexToRgb(theme.bg.quaternary),
    '--bg-inverse': hexToRgb(theme.bg.inverse),
    '--bg-brand': hexToRgb(theme.bg.brand),
    '--bg-success': hexToRgb(theme.bg.success),
    '--bg-danger': hexToRgb(theme.bg.danger),
    '--bg-warning': hexToRgb(theme.bg.warning),
    '--bg-info': hexToRgb(theme.bg.info),
    '--bg-brand-muted': hexToRgb(colors.primary[500]),
    '--bg-secondary-muted': hexToRgb(colors.neutral[500]),
    '--bg-success-muted': hexToRgb(colors.success[500]),
    '--bg-danger-muted': hexToRgb(colors.danger[500]),
    '--bg-warning-muted': hexToRgb(colors.warning[500]),
    '--bg-info-muted': hexToRgb(colors.info[500]),
    '--bg-overlay': hexToRgb(colors.white),
    '--border-primary': hexToRgb(theme.border.primary),
    '--border-secondary': hexToRgb(theme.border.secondary),
    '--border-tertiary': hexToRgb(theme.border.tertiary),
    '--border-inverse': hexToRgb(theme.border.inverse),
    '--border-brand': hexToRgb(theme.border.brand),
    '--border-success': hexToRgb(theme.border.success),
    '--border-danger': hexToRgb(theme.border.danger),
    '--border-warning': hexToRgb(theme.border.warning),
    '--border-info': hexToRgb(theme.border.info),
    '--icon-primary': hexToRgb(theme.icon.primary),
    '--icon-secondary': hexToRgb(theme.icon.secondary),
    '--icon-tertiary': hexToRgb(theme.icon.tertiary),
    '--icon-disabled': hexToRgb(theme.icon.disabled),
    '--icon-inverse': hexToRgb(theme.icon.inverse),
    '--icon-on-color': hexToRgb(theme.icon.onColor),
    '--icon-success': hexToRgb(theme.icon.success),
    '--icon-danger': hexToRgb(theme.icon.danger),
    '--icon-warning': hexToRgb(theme.icon.warning),
    '--icon-info': hexToRgb(theme.icon.info),
    '--icon-brand': hexToRgb(theme.icon.brand),
    '--button-primary': hexToRgb(theme.button.primary),
    '--button-primary-hover': hexToRgb(theme.button.primaryHover),
    '--button-primary-active': hexToRgb(theme.button.primaryActive),
    '--button-secondary': hexToRgb(theme.button.secondary),
    '--button-secondary-hover': hexToRgb(theme.button.secondaryHover),
    '--button-secondary-active': hexToRgb(theme.button.secondaryActive),
    '--button-danger': hexToRgb(theme.button.danger),
    '--button-danger-hover': hexToRgb(theme.button.dangerHover),
    '--button-danger-active': hexToRgb(theme.button.dangerActive),
    '--button-disabled': hexToRgb(theme.button.disabled),
  } as const;
}

export const lightThemeVars = generateThemeVars(lightTheme);
export type LightTheme = typeof lightTheme;
```

- [ ] **Step 5: Create `src/shared/theme/fonts.ts` and `src/shared/theme/index.ts`**

**`fonts.ts`:** Port exactly from source.

**`index.ts`:**
```ts
import { darkTheme } from './theme-dark';
import { lightTheme } from './theme-light';

export { colors } from './colors';
export type { ColorScale, ColorShade } from './colors';
export { darkTheme, darkThemeVars } from './theme-dark';
export { lightTheme, lightThemeVars } from './theme-light';
export type { DarkTheme } from './theme-dark';
export type { LightTheme } from './theme-light';
export { hexToRgb, hexWithAlpha } from './helpers';
export { fonts } from './fonts';

export function getThemeColors(theme: 'light' | 'dark') {
  return theme === 'dark' ? darkTheme : lightTheme;
}

export type ThemeColors = typeof darkTheme;
```

- [ ] **Step 6: Commit**

```bash
git add src/shared/theme/
git commit -m "feat: add theme system with semantic design tokens"
```

---

### Task 4: Utils & Libs

**Files:**
- Create: `src/utils/logger.ts`
- Create: `src/utils/callAPIHelper.ts`
- Create: `src/utils/common.ts`
- Create: `src/utils/updates.ts`
- Create: `src/libs/api.ts`
- Create: `src/libs/storage.ts`
- Create: `src/libs/encryption.ts`
- Create: `src/libs/date.ts`

- [ ] **Step 1: Create `src/utils/logger.ts`**

Port exactly from source. No changes needed.

- [ ] **Step 2: Create `src/libs/encryption.ts`**

Port from source, update keychain service name:
- Change `KEYCHAIN_SERVICE` to `'com.example.myapp.encryption'`
- Change `KEYCHAIN_USERNAME` to `'app-encryption-key'`

- [ ] **Step 3: Create `src/libs/storage.ts`**

Port from source. Change storage ID to `'app-storage'`. Remove domain-specific storage keys (keep only LANGUAGE, THEME, TOKEN, REFRESH_TOKEN).

- [ ] **Step 4: Create `src/libs/api.ts`**

Port from source with these changes:
- Remove `useNetworkDebugStore` import and all debug store references
- Remove domain-specific error messages (wallet import check)
- Remove `NetworkDebugger` references
- Simplify beforeRequest hook (remove debug logging to store)
- Simplify afterResponse hook (remove debug logging to store)
- Simplify beforeError hook (remove debug logging to store)
- Keep: error classes, toast deduplication, auth token, request manager, api helper

- [ ] **Step 5: Create `src/utils/callAPIHelper.ts`**

Port exactly from source. No changes needed.

- [ ] **Step 6: Create `src/libs/date.ts`**

Port from source but only include `en` and `vi` dayjs locales.

- [ ] **Step 7: Create `src/utils/common.ts`**

Port from source. Remove any web3-specific utilities. Keep: color utils, string utils, number utils, array utils, object utils, async utils, device/platform detection, linking utils, validation utils.

- [ ] **Step 8: Create `src/utils/updates.ts`**

Port exactly from source.

- [ ] **Step 9: Commit**

```bash
git add src/utils/ src/libs/
git commit -m "feat: add utils (logger, callAPIHelper, common) and libs (api, storage, date)"
```

---

### Task 5: i18n & Hooks

**Files:**
- Create: `src/shared/i18n/locales/en.ts`
- Create: `src/shared/i18n/locales/vi.ts`
- Create: `src/shared/i18n/index.ts`
- Create: `src/shared/hooks/useTheme.ts`
- Create: `src/shared/hooks/useTranslation.ts`
- Create: `src/shared/hooks/index.ts`

- [ ] **Step 1: Create i18n locales**

Create minimal translation files with generic keys (not domain-specific):

**`en.ts`:**
```ts
export default {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    search: 'Search',
    noResults: 'No results found',
    pressBackAgainToExit: 'Press back again to exit',
    apiError: 'Something went wrong. Please try again.',
  },
  navigation: {
    home: 'Home',
    explore: 'Explore',
    profile: 'Profile',
    settings: 'Settings',
  },
};
```

**`vi.ts`:** Vietnamese translation of the same keys.

- [ ] **Step 2: Create `src/shared/i18n/index.ts`**

Port from source, simplified to only en/vi:

```ts
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

const deviceLanguage = 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
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
export type TranslationKeys = typeof en;
```

- [ ] **Step 3: Create hooks**

**`useTheme.ts`:** Port exactly from source.

**`useTranslation.ts`:** Port from source.

**`index.ts`:**
```ts
export { useTheme } from './useTheme';
export { useTranslation } from './useTranslation';
```

- [ ] **Step 4: Commit**

```bash
git add src/shared/i18n/ src/shared/hooks/
git commit -m "feat: add i18n (en/vi) and hooks (useTheme, useTranslation)"
```

---

### Task 6: Stores

**Files:**
- Create: `src/stores/useUIPreferencesStore.ts`
- Create: `src/stores/useNetworkStore.ts`
- Create: `src/stores/useCounterStore.ts`
- Create: `src/stores/index.ts`

- [ ] **Step 1: Create stores**

Port from source, remove domain-specific stores (wallet, transaction, recentAddresses, networkDebug).

**`useUIPreferencesStore.ts`:** Port exactly from source.
**`useNetworkStore.ts`:** Port exactly from source.
**`useCounterStore.ts`:** Port exactly from source (example store).

**`index.ts`:**
```ts
export { useUIPreferencesStore } from './useUIPreferencesStore';
export { useNetworkStore } from './useNetworkStore';
export { useCounterStore } from './useCounterStore';
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/
git commit -m "feat: add Zustand stores (UIPreferences, Network, Counter example)"
```

---

### Task 7: Providers

**Files:**
- Create: `src/shared/providers/ThemeProvider.tsx`
- Create: `src/shared/providers/ReactQueryProvider.tsx`
- Create: `src/shared/providers/AppInitializer.tsx`
- Create: `src/shared/providers/Application.tsx`
- Create: `src/shared/providers/index.ts`

- [ ] **Step 1: Create `ThemeProvider.tsx`**

Port from source but fix it to actually support both themes (source had dark hardcoded):

```tsx
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useColorScheme, vars } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { darkThemeVars, lightThemeVars } from '@/shared/theme';

const tailwindDarkThemeVars = vars(darkThemeVars);
const tailwindLightThemeVars = vars(lightThemeVars);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colorScheme } = useColorScheme();

  const themeVars = useMemo(() => {
    return colorScheme === 'dark' ? tailwindDarkThemeVars : tailwindLightThemeVars;
  }, [colorScheme]);

  return (
    <View style={[{ flex: 1 }, themeVars]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </View>
  );
};
```

- [ ] **Step 2: Create `ReactQueryProvider.tsx`**

Port exactly from source.

- [ ] **Step 3: Create `AppInitializer.tsx`**

Port from source, remove domain-specific store rehydrations (wallet, recentAddresses):

```tsx
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

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { setColorScheme } = useColorScheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeStorage();
        logger.info('Storage initialized');

        await useUIPreferencesStore.persist.rehydrate();
        logger.info('Zustand stores rehydrated');

        await initializeI18n(storageHelpers, STORAGE_KEYS);

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
  }, []);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};
```

- [ ] **Step 4: Create `Application.tsx`**

Simplified - no Privy, no Auth, no Sheet, no ConnectWallet, no NetworkDebugger, no PolyfillCrypto:

```tsx
import { Toaster, toastRef } from '@/shared/components/toast';
import { useNetworkStore } from '@/stores';
import { createLogger } from '@/utils/logger';
import * as Network from 'expo-network';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppInitializer } from './AppInitializer';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';

const logger = createLogger('Application');

interface ApplicationProps {
  children: React.ReactNode;
}

export const Application: React.FC<ApplicationProps> = ({ children }) => {
  const setNetworkState = useNetworkStore((state) => state.setState);

  useEffect(() => {
    Network.getNetworkStateAsync().then(setNetworkState);
    const subscription = Network.addNetworkStateListener((state) => {
      logger.debug('Network state updated', state);
      setNetworkState(state);
    });
    return () => { subscription.remove(); };
  }, [setNetworkState]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppInitializer>
          <ThemeProvider>
            <ReactQueryProvider>
              {children}
              <Toaster ref={toastRef} position="center" />
            </ReactQueryProvider>
          </ThemeProvider>
        </AppInitializer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
```

- [ ] **Step 5: Create `index.ts`**

```ts
export { Application } from './Application';
export { ThemeProvider } from './ThemeProvider';
export { ReactQueryProvider } from './ReactQueryProvider';
export { AppInitializer } from './AppInitializer';
```

- [ ] **Step 6: Commit**

```bash
git add src/shared/providers/
git commit -m "feat: add providers (Application, Theme, ReactQuery, AppInitializer)"
```

---

### Task 8: Shared Components

**Files:**
- Create: `src/shared/components/Text.tsx`
- Create: `src/shared/components/Box.tsx`
- Create: `src/shared/components/Image.tsx`
- Create: `src/shared/components/Skeleton.tsx`
- Create: `src/shared/components/button/Button.tsx`
- Create: `src/shared/components/button/Button.type.ts`
- Create: `src/shared/components/button/index.ts`
- Create: `src/shared/components/input/Input.tsx`
- Create: `src/shared/components/input/InputArea.tsx`
- Create: `src/shared/components/input/index.ts`
- Create: `src/shared/components/toast/Toast.ts`
- Create: `src/shared/components/toast/ToastItem.tsx`
- Create: `src/shared/components/toast/ToastItemDetailed.tsx`
- Create: `src/shared/components/toast/Toaster.tsx`
- Create: `src/shared/components/toast/index.ts`
- Create: `src/shared/components/index.ts`

- [ ] **Step 1: Port Text and Box components**

Port from source. Remove domain-specific references. These are the base building blocks.

- [ ] **Step 2: Port Image component**

Port from source.

- [ ] **Step 3: Port Skeleton component**

Port from source.

- [ ] **Step 4: Port Button components**

Port Button.tsx, Button.type.ts from source. Remove ResendButton (domain-specific).

- [ ] **Step 5: Port Input components**

Port Input.tsx and InputArea.tsx from source. Remove OTPInput (domain-specific). Remove BottomSheetTextInput references (since we removed sheets).

- [ ] **Step 6: Port Toast components**

Port all toast files from source.

- [ ] **Step 7: Create barrel export `index.ts`**

```ts
export { Text, AnimatedText } from './Text';
export { Box, AnimatedBox } from './Box';
export { Image } from './Image';
export { Skeleton, SkeletonCircle, SkeletonText, SkeletonWrapper } from './Skeleton';
export { Button } from './button';
export { Input, ControlledInput } from './input';
export { InputArea, ControlledInputArea } from './input';
export { Toast } from './toast';
```

- [ ] **Step 8: Commit**

```bash
git add src/shared/components/
git commit -m "feat: add shared components (Text, Box, Image, Skeleton, Button, Input, Toast)"
```

---

### Task 9: Config (Auto-generated)

**Files:**
- Create: `src/config/environment.ts` (will be auto-generated)
- Create: `src/config/routes.ts` (will be auto-generated)
- Create: `src/config/constants.ts`
- Create: `src/config/languages.ts`
- Create: `src/config/index.ts`

- [ ] **Step 1: Create `src/config/constants.ts`**

Port from source, remove domain-specific constants (crypto, web3). Keep: date formats, regex patterns, HTTP status codes, animation durations, debounce delays.

- [ ] **Step 2: Create `src/config/languages.ts`**

Simplified to en/vi only:

```ts
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tieng Viet' },
];

export const getLanguageByCode = (code: string) => LANGUAGES.find((l) => l.code === code);
export const getLanguageName = (code: string) => getLanguageByCode(code)?.nativeName || code;
```

- [ ] **Step 3: Create `src/config/index.ts`**

```ts
export { ENV } from './environment';
export { ROUTES } from './routes';
export * from './constants';
export * from './languages';
```

- [ ] **Step 4: Commit**

```bash
git add src/config/
git commit -m "feat: add config (constants, languages)"
```

---

### Task 10: Resources (Auto-generated)

**Files:**
- Create: `src/resources/images/index.ts`
- Create: `src/resources/icons/index.ts`
- Create: `src/resources/index.ts`

- [ ] **Step 1: Create placeholder resource files**

These will be auto-generated by scripts, but create initial versions:

**`src/resources/images/index.ts`:**
```ts
export const icon = require('../../../assets/images/icon.png');
export const favicon = require('../../../assets/images/favicon.png');
export const logo = require('../../../assets/images/logo.png');
```

**`src/resources/icons/index.ts`:**
```ts
export {};
```

**`src/resources/index.ts`:**
```ts
import * as images from './images';
import * as icons from './icons';

const R = { images, icons };
export default R;
```

- [ ] **Step 2: Commit**

```bash
git add src/resources/
git commit -m "feat: add resources barrel exports"
```

---

### Task 11: Scripts

**Files:**
- Create: `scripts/prebuild.js`
- Create: `scripts/generate-asset-resources.js`
- Create: `scripts/generate-routes.js`
- Create: `scripts/generate-environment.js`

- [ ] **Step 1: Port scripts from source**

Port all 4 scripts exactly from source. They are generic and don't need changes.

- [ ] **Step 2: Commit**

```bash
git add scripts/
git commit -m "feat: add generator scripts (assets, routes, environment, prebuild)"
```

---

### Task 12: Expo Config Plugins

**Files:**
- Create: `plugins/withVersioning.ts`
- Create: `plugins/withCustomNativeConfig.ts`
- Create: `plugins/withOptimizeApkSize.ts`
- Create: `plugins/withAndroidSvgFix.ts`
- Create: `plugins/withAndroidIconKeepRules.ts`
- Create: `plugins/withBuildEnvironments.ts`
- Create: `plugins/withFastlane.ts`
- Create: `plugins/index.ts`
- Create: `plugins/package.json`

- [ ] **Step 1: Port plugins from source**

Port all plugins. Remove `withFirebaseAppDistribution` (domain-specific). All others are generic build optimization plugins.

- [ ] **Step 2: Commit**

```bash
git add plugins/
git commit -m "feat: add Expo config plugins (versioning, APK optimization, build environments)"
```

---

### Task 13: App Routes (Expo Router)

**Files:**
- Create: `src/app/_layout.tsx`
- Create: `src/app/index.tsx`
- Create: `src/app/(tabs)/_layout.tsx`
- Create: `src/app/(tabs)/home.tsx`
- Create: `src/app/(tabs)/explore.tsx`
- Create: `src/app/(tabs)/profile.tsx`

- [ ] **Step 1: Create `src/app/_layout.tsx`**

Simplified from source - no SecureScreen, no PullToRefresh, no LottieCache, no SSL:

```tsx
import { Application } from '@/shared/providers';
import { downloadUpdate } from '@/utils/updates';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform, BackHandler } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { Toast } from '@/shared/components';
import { useTranslation } from '@/shared/hooks';

import '../../global.css';
import '@/shared/i18n';

export default function RootLayout() {
  const { t } = useTranslation();

  useFonts({
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.otf'),
    'Inter-Medium': require('../../assets/fonts/Inter-Medium.otf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.otf'),
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.otf'),
    'Inter-ExtraBold': require('../../assets/fonts/Inter-ExtraBold.otf'),
  });

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#000000');
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('inset-swipe');
    }
    downloadUpdate().catch(() => {});
  }, []);

  // Android back handler - press twice to exit
  const backPressCountRef = useRef(0);
  const backPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressCountRef.current === 0) {
        backPressCountRef.current = 1;
        Toast.show({ message: t('common.pressBackAgainToExit'), type: 'info', duration: 2000 });
        if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
        backPressTimerRef.current = setTimeout(() => { backPressCountRef.current = 0; }, 2000);
        return true;
      } else {
        if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
        BackHandler.exitApp();
        return true;
      }
    });

    return () => {
      backHandler.remove();
      if (backPressTimerRef.current) clearTimeout(backPressTimerRef.current);
    };
  }, [t]);

  return (
    <Application>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#000000' } }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade' }} />
      </Stack>
    </Application>
  );
}
```

- [ ] **Step 2: Create `src/app/index.tsx`**

Simple welcome/entry screen:

```tsx
import { Box, Text } from '@/shared/components';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to tabs after a short delay (simulating splash)
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Box bg="primary" className="flex-1 items-center justify-center">
      <Text variant="headline" color="primary">Welcome</Text>
    </Box>
  );
}
```

- [ ] **Step 3: Create `src/app/(tabs)/_layout.tsx`**

Simplified - 3 generic tabs (Home, Explore, Profile), no auth requirement, no domain-specific icons:

```tsx
import { useTranslation } from '@/shared/hooks';
import { Tabs, usePathname } from 'expo-router';
import { Platform, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FAFAFA',
        tabBarInactiveTintColor: '#717171',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          paddingBottom: 32,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '400',
          marginTop: 4,
        },
        sceneStyle: { backgroundColor: '#000000' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
          tabBarButton: (props) => <HapticTabButton {...props} routeName="home" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: t('navigation.explore'),
          tabBarIcon: ({ color }) => <Ionicons name="compass-outline" size={22} color={color} />,
          tabBarButton: (props) => <HapticTabButton {...props} routeName="explore" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
          tabBarButton: (props) => <HapticTabButton {...props} routeName="profile" />,
        }}
      />
    </Tabs>
  );
}

function HapticTabButton({ children, onPress, routeName, ...props }: any) {
  const pathname = usePathname();
  const handlePress = (e: any) => {
    if (pathname !== `/${routeName}`) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity {...props} onPress={handlePress} activeOpacity={1} style={[props.style, { flex: 1 }]}>
      {children}
    </TouchableOpacity>
  );
}
```

Note: Add `@expo/vector-icons` to package.json dependencies (it's included with Expo).

- [ ] **Step 4: Create tab screens**

**`src/app/(tabs)/home.tsx`:**
```tsx
import { Box, Text } from '@/shared/components';

export default function HomeScreen() {
  return (
    <Box bg="primary" className="flex-1 items-center justify-center">
      <Text variant="headline" color="primary">Home</Text>
      <Text color="secondary" className="mt-2">Welcome to the app</Text>
    </Box>
  );
}
```

**`src/app/(tabs)/explore.tsx`:** Same pattern with "Explore" text.
**`src/app/(tabs)/profile.tsx`:** Same pattern with "Profile" text.

- [ ] **Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: add Expo Router app structure with tab navigation"
```

---

### Task 14: Example Feature Module

**Files:**
- Create: `src/features/home/_screens/HomeScreen.tsx`
- Create: `src/features/home/_components/WelcomeCard.tsx`
- Create: `src/features/home/index.ts`

- [ ] **Step 1: Create example feature**

Demonstrate the feature-based architecture pattern:

**`_screens/HomeScreen.tsx`:**
```tsx
import { Box, Text } from '@/shared/components';
import { useTranslation } from '@/shared/hooks';
import { WelcomeCard } from '../_components/WelcomeCard';

export const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <Box bg="primary" className="flex-1 p-16">
      <Text variant="headline" color="primary" className="mt-48">
        {t('navigation.home')}
      </Text>
      <WelcomeCard />
    </Box>
  );
};
```

**`_components/WelcomeCard.tsx`:**
```tsx
import { Box, Text, Button } from '@/shared/components';
import { useTheme } from '@/shared/hooks';

export const WelcomeCard = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Box bg="secondary" radius="2xl" padding={16} className="mt-16">
      <Text variant="title" color="primary">Welcome to the Boilerplate</Text>
      <Text color="secondary" className="mt-8">
        This is an example feature module demonstrating the architecture.
      </Text>
      <Button
        type="primary"
        size="md"
        className="mt-16"
        onPress={toggleTheme}
      >
        Toggle Theme ({isDark ? 'Dark' : 'Light'})
      </Button>
    </Box>
  );
};
```

**`index.ts`:**
```ts
export { HomeScreen } from './_screens/HomeScreen';
```

Then update `src/app/(tabs)/home.tsx` to import from the feature:
```tsx
export { HomeScreen as default } from '@/features/home';
```

- [ ] **Step 2: Commit**

```bash
git add src/features/
git commit -m "feat: add example home feature module"
```

---

### Task 15: Fastlane & Build Configs

**Files:**
- Create: `fastlane/ios/Fastfile`
- Create: `fastlane/android/Fastfile`
- Create: `.build-numbers.json`

- [ ] **Step 1: Port fastlane configs from source**

Port both Fastfile configs. Remove Firebase App Distribution lanes. Keep: staging, production, beta, release, bundle, test, clean, certificates lanes.

- [ ] **Step 2: Create `.build-numbers.json`**

```json
{
  "phase1": {
    "version": "1.0.0",
    "development": 1,
    "preview": 1,
    "production": 1
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add fastlane/ .build-numbers.json
git commit -m "feat: add fastlane configs and build number management"
```

---

### Task 16: Run Generators & Final Setup

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/longdao/Projects/expo-boilerplate
bun install
```

- [ ] **Step 2: Run generators**

```bash
bun run generate:assets
bun run generate:routes
bun run generate:env
```

- [ ] **Step 3: Run type-check**

```bash
bun run type-check
```

Fix any TypeScript errors that arise.

- [ ] **Step 4: Create CLAUDE.md**

Port the CLAUDE.md from source project, adapted for the boilerplate (remove domain-specific rules, update project name references).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: run generators, fix types, add CLAUDE.md"
```

---

### Task 17: Verify & Smoke Test

- [ ] **Step 1: Start dev server**

```bash
bun run dev
```

Verify it starts without errors.

- [ ] **Step 2: Verify all generators work**

```bash
bun run generate:assets
bun run generate:routes
bun run generate:env
```

- [ ] **Step 3: Verify type-check passes**

```bash
bun run type-check
```

- [ ] **Step 4: Final review commit if needed**

Fix any remaining issues and commit.
