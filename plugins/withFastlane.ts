import { ConfigPlugin, withDangerousMod } from 'expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Plugin to copy fastlane configs into native folders after prebuild
 * Fastlane configs are stored in /fastlane/android and /fastlane/ios
 */
const withFastlane: ConfigPlugin = (config) => {
  // Copy Android fastlane
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const androidFastlanePath = path.join(projectRoot, 'fastlane', 'android');
      const targetFastlanePath = path.join(
        config.modRequest.platformProjectRoot,
        'fastlane'
      );

      if (fs.existsSync(androidFastlanePath)) {
        // Create fastlane directory if it doesn't exist
        if (!fs.existsSync(targetFastlanePath)) {
          fs.mkdirSync(targetFastlanePath, { recursive: true });
        }

        // Copy all files from source to target
        const files = fs.readdirSync(androidFastlanePath);
        files.forEach((file) => {
          const srcFile = path.join(androidFastlanePath, file);
          const destFile = path.join(targetFastlanePath, file);

          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            console.log(`✓ Copied Android fastlane: ${file}`);
          }
        });
      }

      return config;
    },
  ]);

  // Copy iOS fastlane
  config = withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosFastlanePath = path.join(projectRoot, 'fastlane', 'ios');
      const targetFastlanePath = path.join(
        config.modRequest.platformProjectRoot,
        'fastlane'
      );

      if (fs.existsSync(iosFastlanePath)) {
        // Create fastlane directory if it doesn't exist
        if (!fs.existsSync(targetFastlanePath)) {
          fs.mkdirSync(targetFastlanePath, { recursive: true });
        }

        // Copy all files from source to target
        const files = fs.readdirSync(iosFastlanePath);
        files.forEach((file) => {
          const srcFile = path.join(iosFastlanePath, file);
          const destFile = path.join(targetFastlanePath, file);

          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
            console.log(`✓ Copied iOS fastlane: ${file}`);
          }
        });

        // Update scheme name in Fastfile if needed
        const fastfilePath = path.join(targetFastlanePath, 'Fastfile');
        if (fs.existsSync(fastfilePath)) {
          let fastfileContent = fs.readFileSync(fastfilePath, 'utf8');

          // Replace old scheme name with new one from config
          const appName = config.name || 'App';
          fastfileContent = fastfileContent.replace(
            /scheme: "boilerplate"/g,
            `scheme: "${appName}"`
          );
          fastfileContent = fastfileContent.replace(
            /workspace: "boilerplate\.xcworkspace"/g,
            `workspace: "${appName}.xcworkspace"`
          );
          fastfileContent = fastfileContent.replace(
            /xcodeproj: "boilerplate\.xcodeproj"/g,
            `xcodeproj: "${appName}.xcodeproj"`
          );
          fastfileContent = fastfileContent.replace(
            /boilerplate-/g,
            `${appName.toLowerCase().replace(/\s+/g, '-')}-`
          );

          fs.writeFileSync(fastfilePath, fastfileContent, 'utf8');
          console.log(`✓ Updated iOS Fastfile with app name: ${appName}`);
        }
      }

      return config;
    },
  ]);

  return config;
};

export default withFastlane;
