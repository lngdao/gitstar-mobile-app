/**
 * Config Plugin Entry Point
 *
 * Compose all plugins
 *
 * Build plugins:
 * 1. cd plugins
 * 2. npm install (or pnpm install)
 * 3. bun run build
 *
 */

const { withCustomNativeConfig, withVersioning, withAndroidSvgFix, withOptimizeApkSize, withAndroidIconKeepRules } = require('./plugins/build');

module.exports = function withAppPlugins(config) {
  // Apply versioning (version & build number management)
  // Set autoIncrement: true to auto-increment build numbers on each build
  config = withVersioning(config, { autoIncrement: false });

  // Apply custom native configurations
  config = withCustomNativeConfig(config);

  // Fix Android build failures caused by outdated androidsvg library
  config = withAndroidSvgFix(config);

  // Optimize APK size with ABI splits and minification
  // This reduces APK from ~180MB to ~46MB per architecture
  config = withOptimizeApkSize(config, {
    enableMinify: true,
    enableShrinkResources: true,
    enableAbiSplits: true,
    abiFilters: ['armeabi-v7a', 'arm64-v8a'], // Skip x86 emulator architectures for release
  });

  // Add Android resource keep rules to prevent icons from being removed
  // when resource shrinking is enabled in release builds
  config = withAndroidIconKeepRules(config);

  return config;
};
