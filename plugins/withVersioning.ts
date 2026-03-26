import { ConfigPlugin, withXcodeProject } from 'expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Plugin to manage version and build number for different phases and environments
 *
 * Strategy:
 * - Version: Managed per phase in .build-numbers.json
 * - Build Number: Auto-incremented per environment per phase, stored in .build-numbers.json
 *
 * For managing multiple phases (e.g., phase1 v1.0.0, phase2 v2.0.0):
 * - Each phase has independent version and build numbers
 * - Use APP_PHASE env var to switch between phases (set by scripts/prebuild.js)
 */

interface PhaseConfig {
  version: string;
  development: number;
  preview: number;
  production: number;
}

interface BuildNumbers {
  phase1: PhaseConfig;
  phase2: PhaseConfig;
  [key: string]: PhaseConfig; // Allow dynamic phase names
}

const BUILD_NUMBERS_FILE = path.join(process.cwd(), '.build-numbers.json');
const PHASE_FILE = path.join(process.cwd(), '.phase');

/**
 * Read selected phase from file (set by scripts/prebuild.js)
 */
function getSelectedPhase(): string {
  try {
    if (fs.existsSync(PHASE_FILE)) {
      const phase = fs.readFileSync(PHASE_FILE, 'utf-8').trim();
      if (phase) {
        return phase;
      }
    }
  } catch (error) {
    // Ignore errors, will fallback to default
  }
  return 'phase1'; // Default phase
}

/**
 * Read build numbers from file or create default
 */
function getBuildNumbers(): BuildNumbers {
  try {
    if (fs.existsSync(BUILD_NUMBERS_FILE)) {
      const content = fs.readFileSync(BUILD_NUMBERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn('⚠️  Could not read .build-numbers.json, using defaults');
  }

  // Default build numbers
  return {
    phase1: {
      version: '1.0.0',
      development: 1,
      preview: 1,
      production: 1,
    },
    phase2: {
      version: '2.0.0',
      development: 1,
      preview: 1,
      production: 1,
    },
  };
}

/**
 * Save build numbers to file
 */
function saveBuildNumbers(buildNumbers: BuildNumbers): void {
  try {
    fs.writeFileSync(
      BUILD_NUMBERS_FILE,
      JSON.stringify(buildNumbers, null, 2) + '\n',
      'utf-8'
    );
  } catch (error) {
    console.warn('⚠️  Could not write .build-numbers.json:', error);
  }
}

/**
 * Get version and build number for current phase and environment
 * If BUILD_NUMBER env var is set, use it (for CI/CD)
 * Otherwise, use stored build number and optionally increment
 */
function getVersionAndBuildNumber(
  phase: string,
  environment: 'development' | 'preview' | 'production',
  autoIncrement: boolean = false
): { version: string; buildNumber: number } {
  const buildNumbers = getBuildNumbers();

  // Default to phase1 if phase not found
  const phaseConfig = buildNumbers[phase] || buildNumbers.phase1;

  if (!phaseConfig) {
    console.warn(`⚠️  Phase "${phase}" not found in .build-numbers.json, using defaults`);
    return { version: '1.0.0', buildNumber: 1 };
  }

  const version = phaseConfig.version;

  // Priority 1: Use BUILD_NUMBER from environment (CI/CD)
  if (process.env.BUILD_NUMBER) {
    const envBuildNumber = parseInt(process.env.BUILD_NUMBER, 10);
    if (!isNaN(envBuildNumber)) {
      return { version, buildNumber: envBuildNumber };
    }
  }

  // Priority 2: Use stored build number
  let buildNumber = phaseConfig[environment];

  // Auto-increment if requested (for local builds)
  if (autoIncrement && !process.env.BUILD_NUMBER) {
    buildNumber += 1;
    phaseConfig[environment] = buildNumber;
    buildNumbers[phase] = phaseConfig;
    saveBuildNumbers(buildNumbers);
    console.log(
      `📦 Auto-incremented ${phase}/${environment} build number to ${buildNumber}`
    );
  }

  return { version, buildNumber };
}

const withVersioning: ConfigPlugin<{ autoIncrement?: boolean }> = (
  config,
  { autoIncrement = false } = {}
) => {
  // Priority 1: Use APP_PHASE from environment (CI/CD or command line)
  // Priority 2: Read from .phase file (set by prebuild.js)
  // Priority 3: Default to phase1
  const appPhase = process.env.APP_PHASE || getSelectedPhase();
  const appEnv = (process.env.APP_VARIANT ||
    'development') as 'development' | 'preview' | 'production';

  const { version, buildNumber } = getVersionAndBuildNumber(
    appPhase,
    appEnv,
    autoIncrement
  );

  // Set version in config
  config.version = version;

  // Set iOS buildNumber
  config.ios = config.ios || {};
  config.ios.buildNumber = String(buildNumber);

  // Set Android versionCode
  config.android = config.android || {};
  config.android.versionCode = buildNumber;

  // Update Xcode project.pbxproj to sync MARKETING_VERSION and CURRENT_PROJECT_VERSION
  config = withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;

    // Update all build configurations
    const configurations = xcodeProject.pbxXCBuildConfigurationSection();
    Object.keys(configurations).forEach((key) => {
      const buildConfig = configurations[key];
      if (buildConfig.buildSettings) {
        // Update MARKETING_VERSION (version string)
        if (buildConfig.buildSettings.MARKETING_VERSION !== undefined) {
          buildConfig.buildSettings.MARKETING_VERSION = version;
        }
        // Update CURRENT_PROJECT_VERSION (build number)
        if (buildConfig.buildSettings.CURRENT_PROJECT_VERSION !== undefined) {
          buildConfig.buildSettings.CURRENT_PROJECT_VERSION = String(buildNumber);
        }
      }
    });

    return config;
  });

  console.log(
    `📱 Phase: ${appPhase} | Environment: ${appEnv} | Version: ${version} | Build: ${buildNumber}`
  );

  return config;
};

export default withVersioning;
