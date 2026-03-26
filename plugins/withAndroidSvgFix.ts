import { ConfigPlugin, withAppBuildGradle } from 'expo/config-plugins';

/**
 * Config Plugin to fix Android build failures caused by outdated androidsvg library
 *
 * This plugin automatically excludes the com.caverock:androidsvg dependency from all
 * Android dependencies during prebuild. This fixes common build issues including:
 * - CMake / Ninja path errors
 * - "Filename longer than 260 characters" errors
 * - Duplicate classes or missing symbol errors
 * - TurboModules codegen failures
 * - Build failures after updating packages
 *
 * The androidsvg library is outdated and no longer used by React Native or Expo,
 * but sometimes gets pulled in by older native modules.
 *
 * @see Article: "Fixing Android Build Failures Caused by androidsvg in React Native & Expo (2025 Guide)"
 */
const withAndroidSvgFix: ConfigPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    const { modResults } = config;

    // Check if the fix is already applied
    if (modResults.contents.includes('com.caverock')) {
      console.log('✅ AndroidSVG exclusion already configured');
      return config;
    }

    // Find the android block and add configurations
    const androidBlockRegex = /android\s*{/;

    if (!androidBlockRegex.test(modResults.contents)) {
      console.warn('⚠️ Could not find android block in build.gradle');
      return config;
    }

    // Insert the configurations block right after the android { line
    modResults.contents = modResults.contents.replace(
      androidBlockRegex,
      `android {
    // Fix for Android build failures caused by outdated androidsvg library
    // This excludes com.caverock:androidsvg from all dependencies
    // See: plugins/withAndroidSvgFix.ts for more details
    configurations {
        all {
            exclude group: "com.caverock", module: "androidsvg"
        }
    }
`
    );

    console.log('✅ Applied AndroidSVG exclusion fix to android/app/build.gradle');

    return config;
  });
};

export default withAndroidSvgFix;
