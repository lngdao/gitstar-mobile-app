const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Get asset and source extensions
const { assetExts, sourceExts } = config.resolver;

// Enable package exports for select libraries
const resolveRequestWithPackageExports = (context, moduleName, platform) => {
  // Package exports in `zustand` are incompatible, so they need to be disabled
  if (moduleName.startsWith('zustand')) {
    const ctx = {
      ...context,
      unstable_enablePackageExports: false,
    };
    return ctx.resolveRequest(ctx, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Configure resolver for SVG support and package exports
config.resolver = {
  ...config.resolver,
  assetExts: assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...sourceExts, 'svg'],
  resolveRequest: resolveRequestWithPackageExports,
};

// Configure SVG transformer for Expo
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};

// Ignore require cycle warnings for src and node_modules
config.resolver.requireCycleIgnorePatterns = [/^src\/.*/, /node_modules\/.*/];

// Apply NativeWind configuration
module.exports = withNativeWind(config, {
  input: './global.css',
  inlineRem: 16,
  cssTransformOptions: {
    plugins: ['nativewind/babel'],
  },
});
