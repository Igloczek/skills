#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const manifestPath = path.join(__dirname, '..', 'references', 'external-skills.json');
const dependencies = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const manifestFiles = [
  'package.json',
  'pyproject.toml',
  'Cargo.toml',
  'go.mod',
  'composer.json',
  'pom.xml',
  'build.gradle',
  'Gemfile',
];
const projectDirectories = ['src', 'app', 'lib', 'server', 'web', 'test', 'tests', 'docs'];

function usage() {
  console.log('Usage: node init.cjs [--project-dir <path>] [--agent <name>] [--dry-run]');
}

function parseArgs(argv) {
  const options = {
    agent: process.env.SKILLS_AGENT || 'codex',
    dryRun: false,
    projectDir: process.cwd(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--dry-run') {
      options.dryRun = true;
    } else if (argument === '--project-dir' || argument === '-p') {
      options.projectDir = argv[++index];
    } else if (argument === '--agent' || argument === '-a') {
      options.agent = argv[++index];
    } else if (argument === '--help' || argument === '-h') {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!options.projectDir) throw new Error('--project-dir needs a path');
  if (!options.agent || !/^[a-z0-9][a-z0-9_-]*$/i.test(options.agent)) {
    throw new Error('--agent must be a simple agent name');
  }
  return options;
}

function validateManifest() {
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    throw new Error('external skill manifest is empty');
  }

  const names = new Set();
  for (const dependency of dependencies) {
    if (!dependency.name || !/^[a-z0-9][a-z0-9-]*$/i.test(dependency.name)
      || !dependency.source || names.has(dependency.name)) {
      throw new Error('external skill manifest contains an invalid or duplicate entry');
    }
    if (dependency.skill !== undefined && dependency.skill !== null && !dependency.skill) {
      throw new Error(`invalid selected skill for ${dependency.name}`);
    }
    names.add(dependency.name);
  }
}

function existingDirectory(directory) {
  try {
    return fs.statSync(directory).isDirectory();
  } catch {
    return false;
  }
}

function skillRoots() {
  const roots = [path.join(os.homedir(), '.agents', 'skills')];
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  roots.push(path.join(codexHome, 'skills'));
  return [...new Set(roots)];
}

function installedAt(name, roots) {
  return roots.find(root => fs.existsSync(path.join(root, name, 'SKILL.md')));
}

function projectSignals(projectDir) {
  return {
    git: fs.existsSync(path.join(projectDir, '.git')),
    manifests: manifestFiles.filter(file => fs.existsSync(path.join(projectDir, file))),
    directories: projectDirectories.filter(directory => existingDirectory(path.join(projectDir, directory))),
  };
}

function install(dependency, options) {
  const args = ['--yes', 'skills', 'add', dependency.source];
  if (dependency.skill) args.push('--skill', dependency.skill);
  args.push('--global', '--agent', options.agent, '--yes');

  const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const result = spawnSync(executable, args, { stdio: 'inherit' });
  if (result.error) return result.error.message;
  if (result.status !== 0) return `installer exited with status ${result.status}`;
  return null;
}

function main() {
  validateManifest();
  const options = parseArgs(process.argv.slice(2));
  const projectDir = path.resolve(options.projectDir);
  if (!existingDirectory(projectDir)) throw new Error(`project directory not found: ${projectDir}`);

  const aiDirectory = path.join(projectDir, '.ai');
  const aiDirectoryExists = fs.existsSync(aiDirectory);
  if (aiDirectoryExists && !existingDirectory(aiDirectory)) {
    throw new Error(`.ai exists but is not a directory: ${aiDirectory}`);
  }
  if (!options.dryRun && !aiDirectoryExists) fs.mkdirSync(aiDirectory, { recursive: true });

  const signals = projectSignals(projectDir);
  const roots = skillRoots();
  const failures = [];

  console.log(`PROJECT_ROOT: ${projectDir}`);
  console.log(`GIT: ${signals.git ? 'FOUND' : 'NOT_FOUND'}`);
  console.log(`MANIFESTS: ${signals.manifests.join(', ') || 'NONE'}`);
  console.log(`DIRECTORIES: ${signals.directories.join(', ') || 'NONE'}`);
  const aiStatus = aiDirectoryExists ? 'READY' : options.dryRun ? 'WOULD_CREATE' : 'CREATED';
  console.log(`AI_CONFIG_DIR: ${aiDirectory} (${aiStatus})`);
  console.log(`SKILL_AGENT: ${options.agent}`);

  for (const dependency of dependencies) {
    const existingRoot = installedAt(dependency.name, roots);
    if (existingRoot) {
      console.log(`SKILL: ${dependency.name} READY (${existingRoot})`);
      continue;
    }

    if (options.dryRun) {
      console.log(`SKILL: ${dependency.name} WOULD_INSTALL (${dependency.source})`);
      continue;
    }

    console.log(`SKILL: ${dependency.name} INSTALLING (${dependency.source})`);
    const error = install(dependency, options);
    const installedRoot = installedAt(dependency.name, roots);
    if (error || !installedRoot) {
      const reason = error || 'SKILL.md not found in the global skill directories';
      failures.push(`${dependency.name}: ${reason}`);
      console.error(`SKILL: ${dependency.name} FAILED (${reason})`);
    } else {
      console.log(`SKILL: ${dependency.name} READY (${installedRoot})`);
    }
  }

  if (options.dryRun) {
    console.log('Status: DRY_RUN');
  } else if (failures.length > 0) {
    console.error(`Open: ${failures.join('; ')}`);
    console.log('Status: NEEDS_SETUP');
    process.exitCode = 1;
  } else {
    console.log('Status: READY');
  }
}

try {
  main();
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  console.log('Status: NEEDS_SETUP');
  process.exitCode = 1;
}
