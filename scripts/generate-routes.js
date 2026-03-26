#!/usr/bin/env node

/**
 * Generate TypeScript routes file from Expo Router app directory
 * This script scans the app directory and generates typed route constants
 * following Expo Router conventions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const APP_DIR = path.join(__dirname, '../src/app');
const OUTPUT_DIR = path.join(__dirname, '../src/config');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'routes.ts');

/**
 * Get all files recursively from a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Convert file path to route path following Expo Router conventions
 */
function filePathToRoute(filePath) {
  // Only process TypeScript/JavaScript files
  if (!/\.(tsx?|jsx?)$/.test(filePath)) {
    return null;
  }

  // Get relative path from app directory
  let routePath = path.relative(APP_DIR, filePath);

  // Remove file extension
  routePath = routePath.replace(/\.(tsx?|jsx?)$/, '');

  // Skip layout files, underscore prefixed files, and special routes with + prefix
  if (routePath.includes('_layout') || routePath.startsWith('_') || routePath.includes('+')) {
    return null;
  }

  // Convert index to /
  if (routePath === 'index' || routePath.endsWith('/index')) {
    routePath = routePath.replace(/\/?index$/, '');
  }

  // Handle dynamic routes
  // [id] -> :id
  routePath = routePath.replace(/\[([^\]]+)\]/g, (match, content) => {
    // Check if it's a catch-all [...slug]
    if (content.startsWith('...')) {
      return `:${content.slice(3)}/*`;
    }
    return `:${content}`;
  });

  // Add leading slash
  if (!routePath.startsWith('/')) {
    routePath = '/' + routePath;
  }

  // Handle root route
  if (routePath === '/') {
    return '/';
  }

  return routePath;
}

/**
 * Parse route path and determine if it's a dynamic route
 */
function parseRoute(routePath) {
  const hasDynamicSegment = routePath.includes(':');
  const isCatchAll = routePath.includes('/*');

  // Extract parameters from route
  const params = [];
  const segments = routePath.split('/').filter(Boolean);

  segments.forEach((segment) => {
    if (segment.startsWith(':')) {
      const param = segment.replace('/*', ''); // Remove catch-all marker
      params.push(param.slice(1)); // Remove : prefix
    }
  });

  return {
    path: routePath,
    isDynamic: hasDynamicSegment || isCatchAll,
    isCatchAll: isCatchAll,
    params: params,
    segments: segments,
  };
}

/**
 * Generate a nested object structure from routes
 */
function buildRouteTree(routes) {
  const tree = {
    index: '/',
  };

  routes.forEach((route) => {
    if (route === '/') return; // Already handled as index

    const parsed = parseRoute(route);
    const segments = parsed.segments;

    // Handle route groups (tabs)
    if (segments[0]?.startsWith('(') && segments[0]?.endsWith(')')) {
      const groupName = segments[0].slice(1, -1); // Remove parentheses
      const restPath = segments.slice(1);

      if (!tree[groupName]) {
        tree[groupName] = {};
      }

      if (restPath.length === 0) {
        // Just the group itself
        tree[groupName]._root = route;
      } else if (restPath.length === 1 && !parsed.isDynamic) {
        // Simple route in group
        tree[groupName][restPath[0]] = route;
      } else {
        // Nested or dynamic route
        const key = restPath.join('_');
        tree[groupName][key] = route;
      }
    } else if (segments.length === 1 && !parsed.isDynamic) {
      // Top-level simple route
      tree[segments[0]] = route;
    } else if (parsed.isDynamic) {
      // Dynamic route - create a function
      const key = segments.join('_').replace(/:/g, '');
      tree[key] = route;
    } else {
      // Nested route
      const key = segments.join('_');
      tree[key] = route;
    }
  });

  return tree;
}

/**
 * Check if a key needs to be quoted (contains special characters)
 */
function needsQuotes(key) {
  // Check if key is a valid JavaScript identifier
  return !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

/**
 * Format a key for use in object notation
 */
function formatKey(key) {
  return needsQuotes(key) ? `'${key}'` : key;
}

/**
 * Generate TypeScript code for routes object
 */
function generateRoutesObject(routeTree) {
  const entries = [];

  Object.entries(routeTree).forEach(([key, value]) => {
    const formattedKey = formatKey(key);

    if (typeof value === 'string') {
      // Check if this is a dynamic route
      if (value.includes(':') || value.includes('*')) {
        // Generate dynamic route function
        const params = [];
        const segments = value.split('/').filter(Boolean);

        segments.forEach((segment) => {
          if (segment.startsWith(':')) {
            params.push(segment.slice(1));
          }
        });

        if (params.length > 0) {
          const paramsList = params.map((p) => `${p}: string`).join(', ');
          const routePath = value.replace(/:/g, '${');
          const routePathWithClosingBraces = routePath.replace(/(\$\{[^}]+)/g, '$1}');
          entries.push(
            `  ${formattedKey}: (${paramsList}) => \`${routePathWithClosingBraces}\` as const,`
          );
        } else {
          entries.push(`  ${formattedKey}: '${value}',`);
        }
      } else {
        entries.push(`  ${formattedKey}: '${value}',`);
      }
    } else if (typeof value === 'object') {
      // Nested object
      const nested = [];
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        if (nestedKey === '_root') {
          return; // Skip internal markers
        }
        const formattedNestedKey = formatKey(nestedKey);

        if (typeof nestedValue === 'string') {
          // Check if this is a dynamic route
          if (nestedValue.includes(':') || nestedValue.includes('*')) {
            const params = [];
            const segments = nestedValue.split('/').filter(Boolean);

            segments.forEach((segment) => {
              if (segment.startsWith(':')) {
                params.push(segment.slice(1));
              }
            });

            if (params.length > 0) {
              const paramsList = params.map((p) => `${p}: string`).join(', ');
              const routePath = nestedValue.replace(/:/g, '${');
              const routePathWithClosingBraces = routePath.replace(/(\$\{[^}]+)/g, '$1}');
              nested.push(`    ${formattedNestedKey}: (${paramsList}) => \`${routePathWithClosingBraces}\` as const,`);
            } else {
              nested.push(`    ${formattedNestedKey}: '${nestedValue}',`);
            }
          } else {
            nested.push(`    ${formattedNestedKey}: '${nestedValue}',`);
          }
        }
      });
      entries.push(`  ${formattedKey}: {\n${nested.join('\n')}\n  },`);
    }
  });

  return `export const ROUTES = {\n${entries.join('\n')}\n} as const;`;
}


/**
 * Generate the complete routes.ts file
 */
function generateRoutesFile() {
  console.log('🔍 Scanning app directory...');

  // Get all files in app directory
  const allFiles = getAllFiles(APP_DIR);

  // Convert to routes
  const routes = allFiles
    .map(filePathToRoute)
    .filter((route) => route !== null)
    .map((route) => typeof route === 'object' ? route.path : route)
    .sort();

  console.log(`✅ Found ${routes.length} routes`);

  // Build route tree
  const routeTree = buildRouteTree(routes);

  // Generate TypeScript code
  const routesObject = generateRoutesObject(routeTree);

  const content = `/**
 * Centralized route definitions for type-safe navigation
 * Auto-generated from app directory structure
 * DO NOT EDIT MANUALLY - Run 'bun run generate:routes' to update
 *
 * Usage:
 * \`\`\`tsx
 * import { ROUTES } from '@/config/routes';
 * import { Link, useRouter } from 'expo-router';
 *
 * // Simple routes
 * <Link href={ROUTES.index}>Go Home</Link>
 * <Link href={ROUTES.login}>Login</Link>
 *
 * // Tab routes
 * <Link href={ROUTES.tabs.home}>Home</Link>
 * <Link href={ROUTES.tabs.transfer}>Transfer</Link>
 *
 * // Programmatic navigation
 * const router = useRouter();
 * router.push(ROUTES.tabs.home);
 * \`\`\`
 */

${routesObject}

/**
 * Helper to check if a path is a valid route
 */
export const isValidRoute = (path: string): boolean => {
  const allRoutes: string[] = [];

  const extractRoutes = (obj: any): void => {
    Object.values(obj).forEach((value) => {
      if (typeof value === 'string') {
        allRoutes.push(value);
      } else if (typeof value === 'object' && value !== null) {
        extractRoutes(value);
      }
    });
  };

  extractRoutes(ROUTES);
  return allRoutes.includes(path);
};
`;

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log('📁 Created config directory');
  }

  // Write file
  fs.writeFileSync(OUTPUT_FILE, content);
  console.log('✅ Generated routes.ts');

  return routes;
}

// Main execution
console.log('🚀 Generating routes from app directory...\n');

try {
  const routes = generateRoutesFile();

  console.log('\n📋 Generated routes:');
  routes.forEach((route) => console.log(`   ${route}`));

  console.log('\n✨ Routes generation completed successfully!');

  // Format generated file with Prettier
  console.log('\n🎨 Formatting generated file with Prettier...');
  try {
    execSync('npx prettier --write "src/config/routes.ts"', {
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
  console.error('❌ Error generating routes file:', error);
  process.exit(1);
}
