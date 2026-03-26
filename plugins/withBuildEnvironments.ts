import {
  ConfigPlugin,
  withAppBuildGradle,
  withXcodeProject,
  XcodeProject,
} from 'expo/config-plugins';

/**
 * Plugin to configure build environments for Android (flavors) and iOS (schemes)
 *
 * Environments:
 * - staging: For QA testing
 * - production: For production release
 */
const withBuildEnvironments: ConfigPlugin = (config) => {
  // Android: Add product flavors
  config = withAppBuildGradle(config, (config) => {
    const { contents } = config.modResults;

    // Check if flavors already exist
    if (contents.includes('productFlavors')) {
      return config;
    }

    const appName = config.name || 'App';

    const flavorConfig = `
    flavorDimensions "environment"

    productFlavors {
        staging {
            dimension "environment"
            applicationIdSuffix ".staging"
            versionNameSuffix "-staging"
            resValue "string", "app_name", "${appName} (Staging)"
            buildConfigField "String", "ENVIRONMENT", "\\"staging\\""
        }

        production {
            dimension "environment"
            resValue "string", "app_name", "${appName}"
            buildConfigField "String", "ENVIRONMENT", "\\"production\\""
        }
    }
    `;

    // Insert after android { block
    const modifiedContents = contents.replace(
      /android\s*\{/,
      `android {\n${flavorConfig}`
    );

    config.modResults.contents = modifiedContents;
    return config;
  });

  // iOS: Add schemes configuration
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const appName = config.name || 'App';
    const bundleId = config.ios?.bundleIdentifier || 'com.example.app';

    // Add build configurations for staging
    addBuildConfiguration(xcodeProject, 'Staging', 'Release');

    // Add staging scheme if not exists
    const schemes = xcodeProject.hash.project.objects.XCScheme || {};
    const hasStaging = Object.values(schemes).some(
      (scheme: any) => scheme?.name === `${appName}-Staging`
    );

    if (!hasStaging) {
      // We'll need to manually create staging scheme after prebuild
      console.log(
        `⚠️  Remember to create "${appName}-Staging" scheme in Xcode with Staging configuration`
      );
    }

    // Update Info.plist for staging bundle ID
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    Object.keys(configurations).forEach((key) => {
      const buildConfig = configurations[key];
      if (buildConfig.buildSettings && buildConfig.name === 'Staging') {
        buildConfig.buildSettings.PRODUCT_BUNDLE_IDENTIFIER = `${bundleId}.staging`;
        buildConfig.buildSettings.PRODUCT_NAME = `${appName} (Staging)`;
      }
    });

    return config;
  });

  return config;
};

/**
 * Helper to add build configuration to Xcode project
 */
function addBuildConfiguration(
  xcodeProject: XcodeProject,
  configName: string,
  basedOn: 'Debug' | 'Release'
) {
  const configurations = xcodeProject.pbxXCBuildConfigurationSection();
  const configurationList = xcodeProject.pbxXCConfigurationList();

  // Find base configuration
  let baseConfigUuid: string | null = null;
  Object.keys(configurations).forEach((key) => {
    if (configurations[key].name === basedOn) {
      baseConfigUuid = key;
    }
  });

  if (!baseConfigUuid) {
    console.warn(`Base configuration "${basedOn}" not found`);
    return;
  }

  // Check if config already exists
  const configExists = Object.values(configurations).some(
    (config: any) => config.name === configName
  );

  if (configExists) {
    return;
  }

  // Create new configuration based on Release
  const baseConfig = configurations[baseConfigUuid];
  const newConfig = {
    isa: 'XCBuildConfiguration',
    name: configName,
    buildSettings: { ...baseConfig.buildSettings },
  };

  const newConfigUuid = xcodeProject.generateUuid();
  configurations[newConfigUuid] = newConfig;
  configurations[`${newConfigUuid}_comment`] = configName;

  // Add to configuration list
  Object.keys(configurationList).forEach((key) => {
    const list = configurationList[key];
    if (list.buildConfigurations) {
      const hasConfig = list.buildConfigurations.some(
        (config: any) => config.comment === configName
      );
      if (!hasConfig) {
        list.buildConfigurations.push({
          value: newConfigUuid,
          comment: configName,
        });
      }
    }
  });
}

export default withBuildEnvironments;
