#!/usr/bin/env node

/**
 * Generate TypeScript environment configuration from .env.example
 * This script scans .env.example and generates typed environment helpers
 * with proper TypeScript support
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ENV_EXAMPLE_FILE = path.join(__dirname, '../.env.example');
const OUTPUT_DIR = path.join(__dirname, '../src/config');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'environment.ts');

/**
 * Parse .env.example file and extract variable information
 */
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`.env.example file not found at ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const variables = [];
  let currentComment = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      currentComment = [];
      return;
    }

    // Check if it's a commented or uncommented variable line
    const isCommentedVar = trimmed.startsWith('#') && /# *(EXPO_PUBLIC_)?[A-Z_]+=/.test(trimmed);
    const isActiveVar = !trimmed.startsWith('#') && /(EXPO_PUBLIC_)?[A-Z_]+=/.test(trimmed);

    if (isCommentedVar) {
      // Parse commented variable (optional)
      const varLine = trimmed.replace(/^# */, '');
      const match = varLine.match(/^(EXPO_PUBLIC_)?([A-Z_]+)=(.*)$/);
      if (match) {
        const [, prefix, name, defaultValue] = match;
        variables.push({
          name,
          fullName: prefix ? `EXPO_PUBLIC_${name}` : name,
          defaultValue: defaultValue || undefined,
          isRequired: false,
          isOptional: true,
          comment: currentComment.join(' '),
        });
        currentComment = [];
      }
      return;
    }

    if (isActiveVar) {
      // Parse active variable (required)
      const match = trimmed.match(/^(EXPO_PUBLIC_)?([A-Z_]+)=(.*)$/);
      if (match) {
        const [, prefix, name, defaultValue] = match;
        const hasValue = defaultValue && defaultValue !== '';
        variables.push({
          name,
          fullName: prefix ? `EXPO_PUBLIC_${name}` : name,
          defaultValue: defaultValue || undefined,
          isRequired: hasValue,
          isOptional: !hasValue,
          comment: currentComment.join(' '),
        });
        currentComment = [];
      }
      return;
    }

    // It's a regular comment (not a variable)
    if (trimmed.startsWith('#')) {
      const comment = trimmed.slice(1).trim();
      // Skip section headers or separator lines
      if (
        comment &&
        !comment.endsWith('Configuration') &&
        !comment.startsWith('===') &&
        !comment.startsWith('---')
      ) {
        currentComment.push(comment);
      }
      return;
    }
  });

  return variables;
}

/**
 * Infer TypeScript type from default value and optionality
 */
function inferType(defaultValue, isOptional = false) {
  let baseType = 'string';

  if (defaultValue) {
    // Check for boolean
    if (defaultValue === 'true' || defaultValue === 'false') {
      baseType = 'boolean';
    }
    // Check for number
    else if (/^\d+$/.test(defaultValue)) {
      baseType = 'number';
    }
  }

  // For optional variables, always include undefined in union
  return isOptional ? `${baseType} | undefined` : baseType;
}

/**
 * Generate TypeScript interface for environment variables
 */
function generateEnvInterface(variables) {
  const fields = variables.map((v) => {
    const type = inferType(v.defaultValue, v.isOptional);
    const optional = v.isOptional ? '?' : '';
    const comment = v.comment ? `  /** ${v.comment} */\n` : '';
    return `${comment}  ${v.name}${optional}: ${type};`;
  });

  return `interface EnvironmentVariables {
${fields.join('\n')}
}`;
}

/**
 * Generate conversion helper for boolean/number values
 */
function generateValueConverter(variable) {
  const type = inferType(variable.defaultValue);

  if (type === 'boolean') {
    return `value === 'true'`;
  }

  if (type === 'number') {
    return `value ? Number(value) : 0`;
  }

  return 'value';
}

/**
 * Generate typed environment getters
 */
function generateEnvGetters(variables) {
  const getters = variables.map((v) => {
    const type = inferType(v.defaultValue, v.isOptional);
    const converter = generateValueConverter(v);
    const defaultVal = v.defaultValue ? `'${v.defaultValue}'` : 'undefined';
    const comment = v.comment ? `  /** ${v.comment} */\n` : '';

    // For optional variables, always return the union type with undefined
    if (v.isOptional) {
      return `${comment}  get ${v.name}(): ${type} {
    const value = getEnv('${v.fullName}', ${defaultVal});
    return ${converter};
  }`;
    }

    // For required string types, ensure we return string not string | undefined
    if (type === 'string' && v.isRequired) {
      return `${comment}  get ${v.name}(): ${type} {
    const value = getEnv('${v.fullName}', ${defaultVal});
    return value || '';
  }`;
    }

    return `${comment}  get ${v.name}(): ${type} {
    const value = getEnv('${v.fullName}', ${defaultVal});
    return ${converter};
  }`;
  });

  return getters.join(',\n\n');
}

/**
 * Generate the complete environment.ts file
 */
function generateEnvironmentFile() {
  console.log('🔍 Parsing .env.example file...');

  const variables = parseEnvFile(ENV_EXAMPLE_FILE);

  console.log(`✅ Found ${variables.length} environment variables`);

  // Generate TypeScript code
  const envInterface = generateEnvInterface(variables);
  const envGetters = generateEnvGetters(variables);

  const content = `/**
 * Environment Configuration
 * Auto-generated from .env.example
 * DO NOT EDIT MANUALLY - Run 'bun run generate:env' to update
 *
 * Usage:
 * \`\`\`tsx
 * import { ENV } from '@/config/environment';
 *
 * // Access environment variables with full type safety
 * const apiUrl = ENV.API_URL;
 * const enableDebug = ENV.ENABLE_DEBUG;
 *
 * // Check environment
 * if (ENV.isDev) {
 *   console.log('Running in development mode');
 * }
 * \`\`\`
 */

import Constants from 'expo-constants';

${envInterface}

/**
 * Get environment variable with fallback
 * Handles both EXPO_PUBLIC_ prefixed and non-prefixed variables
 */
function getEnv(key: string, fallback?: string): string | undefined {
  // First check Constants.expoConfig.extra (values set via app.config.ts extra field)
  // Strip EXPO_PUBLIC_ prefix when checking extra since extra uses unprefixed keys
  const keyWithoutPrefix = key.replace(/^EXPO_PUBLIC_/, '');
  if (Constants.expoConfig?.extra?.[keyWithoutPrefix]) {
    return Constants.expoConfig.extra[keyWithoutPrefix];
  }

  // Then check process.env with the full key name (may include EXPO_PUBLIC_ prefix)
  const envVar = process.env[key];
  if (envVar) {
    return envVar;
  }

  return fallback;
}

/**
 * Get required environment variable (throws if missing in production)
 */
function getRequiredEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    const error = \`Missing required environment variable: \${key}\`;
    if (__DEV__) {
      console.error('❌', error);
      return '';
    }
    throw new Error(error);
  }
  return value;
}

/**
 * Type-safe environment configuration object
 */
export const ENV = {
  /**
   * Check if running in development
   */
  get isDev() {
    return __DEV__;
  },

  /**
   * Check if running in production
   */
  get isProd() {
    return !__DEV__;
  },

  /**
   * App information from expo config
   */
  get app() {
    return {
      name: Constants.expoConfig?.name || 'App',
      version: Constants.expoConfig?.version || '1.0.0',
      bundleId:
        Constants.expoConfig?.ios?.bundleIdentifier ||
        Constants.expoConfig?.android?.package,
    };
  },

${envGetters},

  /**
   * Raw access to environment variables (use typed properties above instead)
   */
  get: getEnv,
  getRequired: getRequiredEnv,
} as const;

export default ENV;
`;

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Created config directory');
  }

  // Write file
  fs.writeFileSync(OUTPUT_FILE, content);
  console.log('✅ Generated environment.ts');

  return variables;
}

// Main execution
console.log('🚀 Generating environment configuration from .env.example...\n');

try {
  const variables = generateEnvironmentFile();

  console.log('\n📋 Generated environment variables:');
  variables.forEach((v) => {
    const status = v.isRequired ? '(required)' : '(optional)';
    console.log(`   ${v.name} ${status}`);
  });

  console.log('\n✨ Environment generation completed successfully!');

  // Format generated file with Prettier
  console.log('\n🎨 Formatting generated file with Prettier...');
  try {
    execSync('npx prettier --write "src/config/environment.ts"', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    console.log('✅ File formatted successfully!');
  } catch (formatError) {
    console.warn(
      '⚠️  Prettier formatting failed (file is still generated):',
      formatError.message
    );
  }
} catch (error) {
  console.error('❌ Error generating environment file:', error);
  process.exit(1);
}
