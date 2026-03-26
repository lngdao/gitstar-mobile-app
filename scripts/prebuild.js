#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const BUILD_NUMBERS_FILE = path.join(process.cwd(), '.build-numbers.json');

// Read available phases from .build-numbers.json
function getAvailablePhases() {
  try {
    const content = fs.readFileSync(BUILD_NUMBERS_FILE, 'utf-8');
    const buildNumbers = JSON.parse(content);
    return Object.keys(buildNumbers).map((phase, index) => ({
      key: String(index + 1),
      phase,
      version: buildNumbers[phase].version,
    }));
  } catch (error) {
    console.error('❌ Could not read .build-numbers.json');
    process.exit(1);
  }
}

// Create readline interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Prompt user to select phase
async function selectPhase() {
  const phases = getAvailablePhases();

  console.log('\n🚀 Select Phase to Build:\n');
  phases.forEach(({ key, phase, version }) => {
    console.log(`  ${key}. ${phase} (v${version})`);
  });
  console.log('');

  const rl = createInterface();

  return new Promise((resolve) => {
    rl.question('Enter phase number: ', (answer) => {
      rl.close();
      const selectedIndex = parseInt(answer, 10) - 1;
      if (selectedIndex >= 0 && selectedIndex < phases.length) {
        resolve(phases[selectedIndex].phase);
      } else {
        console.error('❌ Invalid selection');
        process.exit(1);
      }
    });
  });
}

// Save selected phase to file
function saveSelectedPhase(phase) {
  const phasePath = path.join(process.cwd(), '.phase');
  try {
    fs.writeFileSync(phasePath, phase, 'utf-8');
  } catch (error) {
    console.warn('⚠️  Could not save .phase file:', error);
  }
}

// Main function
async function main() {
  // If APP_PHASE is already set (from CI/CD or command line), skip prompt
  if (process.env.APP_PHASE) {
    console.log(`\n📱 Using phase: ${process.env.APP_PHASE}`);
    saveSelectedPhase(process.env.APP_PHASE);
  } else {
    const selectedPhase = await selectPhase();
    process.env.APP_PHASE = selectedPhase;
    saveSelectedPhase(selectedPhase);
    console.log(`\n✅ Selected phase: ${selectedPhase}\n`);
  }

  // Get additional arguments passed to script
  const args = process.argv.slice(2);
  const platform = args.includes('--platform')
    ? args[args.indexOf('--platform') + 1]
    : null;

  // Build expo prebuild command
  let command = 'expo prebuild';
  if (platform) {
    command += ` --platform ${platform}`;
  }
  command += ' --clean --no-install';

  // Execute prebuild with APP_PHASE environment variable
  try {
    console.log(`🔨 Running: ${command}\n`);
    execSync(command, {
      stdio: 'inherit',
      env: { ...process.env },
    });
    console.log('\n✅ Prebuild completed successfully!');
  } catch (error) {
    console.error('\n❌ Prebuild failed');
    process.exit(1);
  }
}

main();
