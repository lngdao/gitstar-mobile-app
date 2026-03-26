import { ConfigPlugin, withAppBuildGradle, withGradleProperties } from 'expo/config-plugins';

interface OptimizeApkOptions {
  /**
   * Enable minification with R8/ProGuard
   * @default true
   */
  enableMinify?: boolean;

  /**
   * Enable resource shrinking
   * @default true
   */
  enableShrinkResources?: boolean;

  /**
   * Enable ABI splits to generate separate APKs for each architecture
   * @default true
   */
  enableAbiSplits?: boolean;

  /**
   * Architectures to include
   * @default ['armeabi-v7a', 'arm64-v8a']
   */
  abiFilters?: string[];
}

/**
 * Config Plugin to optimize Android APK size
 *
 * This plugin enables:
 * - ABI splits: Generate separate APKs for each CPU architecture
 * - Minification: Enable R8/ProGuard code shrinking
 * - Resource shrinking: Remove unused resources
 *
 * Usage:
 * - For testing: Build separate APKs per architecture
 * - For production: Use AAB (bundleRelease) which Google Play optimizes automatically
 */
const withOptimizeApkSize: ConfigPlugin<OptimizeApkOptions | void> = (config, options = {}) => {
  const {
    enableMinify = true,
    enableShrinkResources = true,
    enableAbiSplits = true,
    abiFilters = ['armeabi-v7a', 'arm64-v8a'],
  } = options || {};

  // Enable minify and shrink resources via gradle.properties
  config = withGradleProperties(config, (config) => {
    if (enableMinify) {
      // Remove existing property if present
      config.modResults = config.modResults.filter(
        (item) => !(item.type === 'property' && item.key === 'android.enableMinifyInReleaseBuilds')
      );
      config.modResults.push({
        type: 'property',
        key: 'android.enableMinifyInReleaseBuilds',
        value: 'true',
      });
    }

    if (enableShrinkResources) {
      config.modResults = config.modResults.filter(
        (item) => !(item.type === 'property' && item.key === 'android.enableShrinkResourcesInReleaseBuilds')
      );
      config.modResults.push({
        type: 'property',
        key: 'android.enableShrinkResourcesInReleaseBuilds',
        value: 'true',
      });
    }

    return config;
  });

  // Add ABI splits configuration
  if (enableAbiSplits) {
    config = withAppBuildGradle(config, (config) => {
      const { modResults } = config;

      // Check if splits already configured
      if (modResults.contents.includes('splits {')) {
        console.log('✅ ABI splits already configured');
        return config;
      }

      // Find the android block closing brace and add splits before it
      const abiFiltersStr = abiFilters.map((abi) => `"${abi}"`).join(', ');

      const splitsConfig = `
    // APK size optimization: Generate separate APKs for each ABI
    splits {
        abi {
            enable true
            reset()
            include ${abiFiltersStr}
            universalApk false // Set to true if you need a universal APK
        }
    }

    // Version code for each ABI to ensure proper update ordering
    project.ext.versionCodes = [
        'armeabi-v7a': 1,
        'arm64-v8a': 2,
        'x86': 3,
        'x86_64': 4
    ]

    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            def abi = output.getFilter(com.android.build.OutputFile.ABI)
            if (abi != null) {
                output.versionCodeOverride = defaultConfig.versionCode * 10 + project.ext.versionCodes.get(abi, 0)
            }
        }
    }
`;

      // Find the android block and insert before packagingOptions or androidResources
      // These are typically at the end of the android block
      const insertPoints = [
        'packagingOptions {',
        'androidResources {',
        'buildTypes {',
      ];

      let insertIndex = -1;
      for (const point of insertPoints) {
        const index = modResults.contents.indexOf(point);
        if (index !== -1) {
          insertIndex = index;
          break;
        }
      }

      if (insertIndex !== -1) {
        modResults.contents =
          modResults.contents.slice(0, insertIndex) +
          splitsConfig +
          '\n    ' +
          modResults.contents.slice(insertIndex);
      } else {
        console.warn('⚠️ Could not find suitable insertion point for ABI splits');
      }

      console.log('✅ Applied ABI splits configuration for APK size optimization');

      return config;
    });
  }

  return config;
};

export default withOptimizeApkSize;
