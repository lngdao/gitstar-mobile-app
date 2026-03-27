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
    let { contents } = config.modResults;

    // Check if use_modular_headers! is already added
    if (!contents.includes('use_modular_headers!')) {
      // Find target block and add use_modular_headers! after use_expo_modules!
      const targetRegex = /(target\s+['"][^'"]+['"]\s+do\s*\n\s*use_expo_modules!)/;

      if (targetRegex.test(contents)) {
        contents = contents.replace(
          targetRegex,
          `$1\n  use_modular_headers!`
        );
      } else {
        console.warn('⚠️ Could not find target block to add use_modular_headers!');
      }
    }

    // Fix Xcode 26.4 compatibility
    if (!contents.includes('FMT_USE_CONSTEVAL')) {
      const xcode26Fix = [
        '',
        '    # Fix Xcode 26 — disable explicit modules',
        '    installer.pods_project.targets.each do |target|',
        '      target.build_configurations.each do |bc|',
        "        bc.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'NO'",
        '      end',
        '    end',
        '',
        '    # Fix Xcode 26.4 — patch fmt consteval issue',
        "    fmt_base = File.join(installer.sandbox.pod_dir('fmt'), 'include', 'fmt', 'base.h')",
        '    if File.exist?(fmt_base)',
        '      File.chmod(0644, fmt_base)',
        '      content = File.read(fmt_base)',
        "      patched = content.gsub(/#\\s*define FMT_USE_CONSTEVAL 1/, '# define FMT_USE_CONSTEVAL 0')",
        '      if patched != content',
        '        File.write(fmt_base, patched)',
        "        puts '✅ Patched fmt/base.h: disabled FMT_USE_CONSTEVAL for Xcode 26.4'",
        '      end',
        '    end',
        '',
      ].join('\n');

      // Insert before the closing `end` of post_install block
      contents = contents.replace(
        /(post_install\s+do\s+\|installer\|[\s\S]*?)(^\s+end\s*$)/m,
        `$1${xcode26Fix}\n$2`
      );
    }

    config.modResults.contents = contents;
    return config;
  });

  return config;
};

export default withCustomNativeConfig;
