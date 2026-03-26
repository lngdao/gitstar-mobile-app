import {
  ConfigPlugin,
  withGradleProperties,
  withAppBuildGradle,
  withProjectBuildGradle,
  withInfoPlist,
  withPodfile,
  AndroidConfig,
  IOSConfig,
} from 'expo/config-plugins';

const withCustomNativeConfig: ConfigPlugin = (config) => {
  // Android configurations
  config = withGradleProperties(config, (config) => {
    config.modResults.push(
      // New Architecture
      { type: 'property', key: 'newArchEnabled', value: 'true' },
      // Hermes
      { type: 'property', key: 'hermesEnabled', value: 'true' },
      // Edge to Edge
      { type: 'property', key: 'edgeToEdgeEnabled', value: 'true' },
      // Image formats
      { type: 'property', key: 'expo.gif.enabled', value: 'true' },
      { type: 'property', key: 'expo.webp.enabled', value: 'true' },
      { type: 'property', key: 'expo.webp.animated', value: 'false' },
      // Network Inspector
      { type: 'property', key: 'EX_DEV_CLIENT_NETWORK_INSPECTOR', value: 'true' },
      // Legacy Packaging
      { type: 'property', key: 'expo.useLegacyPackaging', value: 'false' },
      // JVM args for better performance
      {
        type: 'property',
        key: 'org.gradle.jvmargs',
        value: '-Xmx2048m -XX:MaxMetaspaceSize=512m',
      },
      // Parallel builds
      { type: 'property', key: 'org.gradle.parallel', value: 'true' },
      // AndroidX
      { type: 'property', key: 'android.useAndroidX', value: 'true' },
      // PNG Crunching
      { type: 'property', key: 'android.enablePngCrunchInReleaseBuilds', value: 'true' },
      // React Native Architectures
      {
        type: 'property',
        key: 'reactNativeArchitectures',
        value: 'armeabi-v7a,arm64-v8a,x86,x86_64',
      }
    );
    return config;
  });

  // Keep custom JitPack repository
  config = withProjectBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('jitpack.io')) {
      config.modResults.contents = config.modResults.contents.replace(
        /allprojects\s*{[\s\S]*?repositories\s*{/,
        `allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }`
      );
    }
    return config;
  });

  // iOS configurations
  config = withInfoPlist(config, (config) => {
    // Add any custom Info.plist entries here if needed
    return config;
  });

  // Add use_modular_headers! to Podfile for Firebase compatibility
  config = withPodfile(config, (config) => {
    const { contents } = config.modResults;

    // Check if use_modular_headers! is already added
    if (contents.includes('use_modular_headers!')) {
      return config;
    }

    // Find target block and add use_modular_headers! after use_expo_modules!
    const targetRegex = /(target\s+['"][^'"]+['"]\s+do\s*\n\s*use_expo_modules!)/;

    if (targetRegex.test(contents)) {
      config.modResults.contents = contents.replace(
        targetRegex,
        `$1\n  use_modular_headers!`
      );
    } else {
      console.warn('⚠️ Could not find target block to add use_modular_headers!');
    }

    return config;
  });

  return config;
};

export default withCustomNativeConfig;
