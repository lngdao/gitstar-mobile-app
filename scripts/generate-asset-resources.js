#!/usr/bin/env node

/**
 * Asset Resources Generator
 * Auto-generates TypeScript exports for images, icons and others
 *
 * Source: assets/ (root level - where actual files are stored)
 * Target: src/[target]/ (generated TypeScript exports)
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const WORKSPACE_PATH = path.resolve(__dirname, '..');

// Config
const config = {
  // Source folder (where actual asset files are stored)
  sourceAssetFolder: 'assets',
  // Target folder (where generated exports will be created)
  targetAssetFolder: 'src/resources',
  resources: {
    images: {
      exts: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif'],
      handler: imageHandler,
    },
    icons: {
      exts: ['svg'],
      handler: iconHandler,
    },
  },
};

/**
 * Utils for recursive file scanning
 */
function getAllFilesRecursively(dirPath, basePath = dirPath) {
  const results = [];

  if (!isDirectory(dirPath)) {
    return results;
  }

  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(basePath, fullPath);

    if (isDirectory(fullPath)) {
      // Recursively scan subdirectories
      results.push(...getAllFilesRecursively(fullPath, basePath));
    } else {
      // Add file with its relative path
      results.push(relativePath);
    }
  });

  return results;
}

/**
 * Default Handler - Works for most asset types
 * Can be overridden for custom behavior
 */
function defaultHandler(res, options = {}) {
  const {
    exportTemplate = (itemName, itemPath) => `export const ${itemName} = require('${itemPath}');`,
    resourceLabel = res.name.charAt(0).toUpperCase() + res.name.slice(1),
  } = options;

  const allFiles = getAllFilesRecursively(res.sourcePath);

  log.done(`Found ${allFiles.length} items (including nested)`);

  let i = 0;

  if (!allFiles.length) {
    const emptyContent = `/**
 * ${resourceLabel} Resources
 * Auto-generated from assets/${res.name}/
 * DO NOT EDIT MANUALLY - Run 'bun run generate:assets' to update
 */

export {};`;
    fs.writeFileSync(res.targetFilePath, emptyContent);
    return { [res.name]: i };
  }

  const notice = `/**
 * ${resourceLabel} Resources
 * Auto-generated from assets/${res.name}/
 * DO NOT EDIT MANUALLY - Run 'bun run generate:assets' to update
 */

`;

  // Track used names to detect duplicates
  const usedNames = new Map();

  const content = allFiles
    .map((relativePath) => {
      const fileName = path.basename(relativePath);

      // Create name from file name only (no folder prefix)
      let itemName = parseFileName(fileName);

      // Relative path from target file to source asset
      const itemPath = res.relativePathToSource + '/' + relativePath.replace(/\\/g, '/');

      if (matchFileExt(fileName, res.exts)) {
        // Check for duplicate names and auto-suffix
        if (usedNames.has(itemName)) {
          const originalPath = usedNames.get(itemName);
          log.warn(`Duplicate name detected: "${itemName}" (${originalPath} vs ${relativePath})`);

          let suffix = 2;
          let newName = `${itemName}_${suffix}`;
          while (usedNames.has(newName)) {
            suffix++;
            newName = `${itemName}_${suffix}`;
          }
          log.warn(`  -> Auto-renamed to: "${newName}"`);
          itemName = newName;
        }

        usedNames.set(itemName, relativePath);
        i++;
        return exportTemplate(itemName, itemPath);
      } else {
        log.warn(`- ${relativePath} (not in list of extensions)`);
        return null;
      }
    })
    .filter(Boolean)
    .join('\n');

  if (i !== 0) {
    log.done(`Write ${i} files`);
    log.done('Rewrite entry file');
    fs.writeFileSync(res.targetFilePath, notice + content);
    prettier(res.targetPath);
  }

  return { [res.name]: i };
}

/**
 * Handlers
 */
function imageHandler(res) {
  return defaultHandler(res, {
    exportTemplate: (itemName, itemPath) => `export const ${itemName} = require('${itemPath}');`,
    resourceLabel: 'Image',
  });
}

function iconHandler(res) {
  return defaultHandler(res, {
    exportTemplate: (itemName, itemPath) => `export {default as ${itemName}} from '${itemPath}';`,
    resourceLabel: 'Icon',
  });
}

/**
 * Logger
 */
const log = console.log;
const logLine = (...args) =>
  Boolean(args.length) && log(`\n${args[0]}`, ...args.slice(1));

Object.assign(log, {
  done: log.bind(console, '✓ %s'),
  warn: log.bind(console, '✕ %s'),
  special: logLine.bind(console, '👌  %s'),
});

/**
 * Utils
 */
function spinLoading(text = '', chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉']) {
  let x = 0;

  process.stdout.write(chars[x++] + ' ' + text);

  return setInterval(function () {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(chars[x++] + ' ' + text);
    x = x % chars.length;
  }, 10);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearLoading(_loading) {
  if (_loading) {
    clearInterval(_loading);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }
}

function isDirectory(_path) {
  try {
    const stat = fs.statSync(_path);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

function parseFileName(_name) {
  return path.parse(_name).name.replace(/-/g, '_').replace(/ /g, '');
}

function matchFileExt(_name, _exts = []) {
  if (!_exts.length) {
    return true;
  }

  const ext = path.extname(_name).slice(1);

  if (!ext) {
    return false;
  }

  return _exts.includes(ext.toLowerCase());
}

function prettier(_path) {
  try {
    execSync(`npx prettier --write ${_path}`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
  } catch (error) {
    log.warn('Prettier formatting failed, but continuing...');
  }
}

function getSubItems(_path) {
  if (!isDirectory(_path)) {
    return [];
  }

  return fs.readdirSync(_path);
}

function createFolder(_path) {
  return fs.mkdirSync(_path, { recursive: true });
}

function createFile(_path, content = '') {
  return fs.writeFileSync(_path, content);
}

/**
 * Execute
 */
async function executeTask({ msg, task, wait = 100 }) {
  let _loading;
  let _result;

  try {
    _loading = spinLoading(msg);
    await delay(wait);
    log('\r');
    _result = await task(_loading);
  } catch (e) {
    log.warn(e.message);
  } finally {
    clearLoading(_loading);
  }

  return _result;
}

async function script() {
  // Read config
  const { isAllowContinue, sourceAssetPath, targetAssetPath, resources, resourcesName, rootEntryPath } =
    await executeTask({
      msg: 'Reading config...',
      task: () => {
        if (!Object.keys(config).length) {
          throw new Error('Config not found or something is weird. Please check');
        }

        const _sourceAssetPath = path.resolve(WORKSPACE_PATH, config.sourceAssetFolder);
        const _targetAssetPath = path.resolve(WORKSPACE_PATH, config.targetAssetFolder);
        const _rootEntryPath = path.resolve(_targetAssetPath, 'index.ts');

        const _resourcesName = Object.keys(config.resources);
        if (!_resourcesName.length) {
          return { isAllowContinue: false };
        }

        log.done(`Source assets: ${config.sourceAssetFolder}/`);
        log.done(`Target exports: ${config.targetAssetFolder}/`);
        log.done(`Resources: ${_resourcesName.join(' | ')}`);

        return {
          isAllowContinue: true,
          sourceAssetPath: _sourceAssetPath,
          targetAssetPath: _targetAssetPath,
          resourcesName: _resourcesName,
          rootEntryPath: _rootEntryPath,
          resources: _resourcesName.map((resourceName) => {
            const res = config.resources[resourceName];

            const sourcePath = path.resolve(_sourceAssetPath, resourceName);
            const targetPath = path.resolve(_targetAssetPath, resourceName);
            const targetFilePath = path.resolve(targetPath, 'index.ts');

            // Calculate relative path from target file to source folder
            // e.g., from src/assets/images/index.ts to assets/images/
            const relativePathToSource = path.relative(targetPath, sourcePath);

            return {
              name: resourceName,
              sourcePath, // assets/images/
              targetPath, // src/assets/images/
              targetFilePath, // src/assets/images/index.ts
              relativePathToSource, // ../../../assets/images
              exts: res.exts,
              handler: res.handler,
            };
          }),
        };
      },
    });

  if (!isAllowContinue) {
    log.warn('No resources defined in config');
    return;
  }

  // Check source assets folder path
  await executeTask({
    msg: 'Check source assets folder...',
    task: () => {
      const _isSourceAssetFolderExist = fs.existsSync(sourceAssetPath);

      if (!_isSourceAssetFolderExist) {
        log.warn('Source assets folder does not exist');
        createFolder(sourceAssetPath);
        log.done('Source assets folder created');
      } else {
        log.done('Source assets folder exists');
      }
    },
  });

  // Check target assets folder path
  await executeTask({
    msg: 'Check target assets folder...',
    task: () => {
      const _isTargetAssetFolderExist = fs.existsSync(targetAssetPath);

      if (!_isTargetAssetFolderExist) {
        log.warn('Target assets folder does not exist');
        createFolder(targetAssetPath);
        log.done('Target assets folder created');
      } else {
        log.done('Target assets folder exists');
      }
    },
  });

  // Analytics
  await executeTask({
    msg: 'Reading source assets folder...',
    task: () => {
      const subItems = getSubItems(sourceAssetPath);
      log.done(`${subItems.length} items found: ${subItems.join(', ')}`);

      subItems.forEach((item) => {
        const itemPath = path.resolve(sourceAssetPath, item);

        if (isDirectory(itemPath)) {
          if (!resourcesName.includes(item)) {
            log.warn(`- ${item} (d) (not in config)`);
          } else {
            log.done(`+ ${item} (d)`);
          }
        } else {
          log.warn(`- ${item} (f)`);
        }
      });
    },
  });

  let resCount = {};
  // Handle assets
  for (const res of resources) {
    await executeTask({
      msg: `Handling ${res.name} folder...`,
      task: () => {
        // Check source folder exists
        const isSourceExist = fs.existsSync(res.sourcePath);

        if (!isSourceExist) {
          log.done(`Create source ${res.name} folder`);
          createFolder(res.sourcePath);
        } else {
          log.done(`Reading source ${res.name} folder`);
        }

        // Check target folder exists
        const isTargetExist = fs.existsSync(res.targetPath);

        if (!isTargetExist) {
          log.done(`Create target ${res.name} folder`);
          createFolder(res.targetPath);
        }

        const isEntryExist = fs.existsSync(res.targetFilePath);

        if (!isEntryExist) {
          log.done('Create entry file');
          const emptyFileContent = 'export {};';
          createFile(res.targetFilePath, emptyFileContent);
        }

        const result = res.handler(res);
        resCount = { ...resCount, ...result };
      },
    });
  }

  // Rewrite root entry
  await executeTask({
    msg: 'Rewrite root entry file...',
    task: () => {
      const isExist = fs.existsSync(rootEntryPath);

      if (!isExist) {
        log.done('Creating index.ts file');
        createFile(rootEntryPath, 'export {};');
      } else {
        log.done('Reading index.ts file');
      }

      const importContent = resourcesName
        .map((name) => `import * as ${name} from './${name}';`)
        .join('\n');

      const content = `/**
 * Asset Resources
 * Auto-generated barrel export from assets/
 * DO NOT EDIT MANUALLY - Run 'bun run generate:assets' to update
 */

${importContent}

const R = {${resourcesName.join(',')}}

export default R;
`;

      fs.writeFileSync(rootEntryPath, content);
      prettier(rootEntryPath);

      log.special(
        `Total: ${Object.keys(resCount)
          .map((key) => `${resCount[key]} ${key}`)
          .join(' | ')}`,
      );
    },
  });
}

script();
