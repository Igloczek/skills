import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

type Dependency = {
  name: string;
  source: string;
  skill?: string | null;
  group: string;
  usedBy: string[];
};

type Options = {
  agent: string;
  companions: Set<string>;
  dryRun: boolean;
  projectDir: string;
  refresh: boolean;
};

type DirectoryEntry = {
  name: string;
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
};

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(scriptDirectory, '..', 'references', 'external-skills.json');
const dependencies = JSON.parse(readFileSync(manifestPath, 'utf8')) as Dependency[];

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

function usage(): void {
  console.log('Usage: bun init.ts [--project-dir <path>] [--agent <name|*>] [--companions <group,...>] [--refresh] [--dry-run]');
  console.log('   or: node --experimental-strip-types init.ts [same options]');
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    agent: process.env.SKILLS_AGENT || '*',
    companions: new Set(),
    dryRun: false,
    projectDir: process.cwd(),
    refresh: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--dry-run') {
      options.dryRun = true;
    } else if (argument === '--refresh') {
      options.refresh = true;
    } else if (argument === '--companions') {
      const groups = argv[++index];
      if (!groups) throw new Error('--companions needs a comma-separated group list');
      for (const group of groups.split(',')) options.companions.add(group.trim());
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
  if (!options.agent || (options.agent !== '*' && !/^[a-z0-9][a-z0-9_-]*$/i.test(options.agent))) {
    throw new Error('--agent must be * or a simple agent name');
  }
  if ([...options.companions].some(group => !/^[a-z0-9][a-z0-9-]*$/i.test(group))) {
    throw new Error('--companions contains an invalid group');
  }
  return options;
}

function validateManifest(): void {
  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    throw new Error('external skill manifest is empty');
  }

  const names = new Set<string>();
  for (const dependency of dependencies) {
    if (!dependency.name || !/^[a-z0-9][a-z0-9-]*$/i.test(dependency.name)
      || !dependency.group || !/^[a-z0-9][a-z0-9-]*$/i.test(dependency.group)
      || !dependency.source || names.has(dependency.name)) {
      throw new Error('external skill manifest contains an invalid or duplicate entry');
    }
    if (dependency.skill !== undefined && dependency.skill !== null && !dependency.skill) {
      throw new Error(`invalid selected skill for ${dependency.name}`);
    }
    if (!Array.isArray(dependency.usedBy) || dependency.usedBy.length === 0
      || dependency.usedBy.some(name => !/^[a-z0-9][a-z0-9-]*$/i.test(name))) {
      throw new Error(`invalid usedBy list for ${dependency.name}`);
    }
    names.add(dependency.name);
  }
}

function existingDirectory(directory: string): boolean {
  try {
    return statSync(directory).isDirectory();
  } catch {
    return false;
  }
}

function skillRoots(projectDir: string): string[] {
  const roots: string[] = [];
  const ignored = new Set(['.git', 'node_modules', '.venv', 'vendor']);
  const pending: Array<{ directory: string; depth: number }> = [{ directory: projectDir, depth: 0 }];

  while (pending.length > 0) {
    const { directory, depth } = pending.pop()!;
    let entries: DirectoryEntry[];
    try {
      entries = readdirSync(directory, { withFileTypes: true }) as DirectoryEntry[];
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (ignored.has(entry.name)) continue;
      const child = join(directory, entry.name);
      if (entry.name === 'skills' && (entry.isDirectory() || entry.isSymbolicLink())) {
        roots.push(child);
        continue;
      }
      if (entry.isDirectory() && depth < 3) pending.push({ directory: child, depth: depth + 1 });
    }
  }

  return roots;
}

function installedAt(name: string, projectDir: string): string | undefined {
  const roots = skillRoots(projectDir);
  return roots.find(root => existsSync(join(root, name, 'SKILL.md')));
}

function projectSignals(projectDir: string): {
  git: boolean;
  manifests: string[];
  directories: string[];
} {
  return {
    git: existsSync(join(projectDir, '.git')),
    manifests: manifestFiles.filter(file => existsSync(join(projectDir, file))),
    directories: projectDirectories.filter(directory => existingDirectory(join(projectDir, directory))),
  };
}

function install(dependency: Dependency, options: Options, projectDir: string): string | null {
  const args = ['skills', 'add', dependency.source];
  if (dependency.skill) args.push('--skill', dependency.skill);
  args.push('--agent', options.agent, '--yes');

  const executable = process.platform === 'win32' ? 'bunx.exe' : 'bunx';
  const result = spawnSync(executable, args, { cwd: projectDir, stdio: 'inherit' });
  if (result.error) return result.error.message;
  if (result.status !== 0) return `installer exited with status ${result.status}`;
  return null;
}

function refresh(dependency: Dependency, projectDir: string): string | null {
  const executable = process.platform === 'win32' ? 'bunx.exe' : 'bunx';
  const result = spawnSync(executable, ['skills', 'update', dependency.name, '--project', '--yes'], {
    cwd: projectDir,
    stdio: 'inherit',
  });
  if (result.error) return result.error.message;
  if (result.status !== 0) return `updater exited with status ${result.status}`;
  return null;
}

function main(): void {
  validateManifest();
  const options = parseArgs(process.argv.slice(2));
  const projectDir = resolve(options.projectDir);
  if (!existingDirectory(projectDir)) throw new Error(`project directory not found: ${projectDir}`);

  const aiDirectory = join(projectDir, '.ai');
  const aiDirectoryExists = existsSync(aiDirectory);
  if (aiDirectoryExists && !existingDirectory(aiDirectory)) {
    throw new Error(`.ai exists but is not a directory: ${aiDirectory}`);
  }
  if (!options.dryRun && !aiDirectoryExists) mkdirSync(aiDirectory, { recursive: true });

  const signals = projectSignals(projectDir);
  const failures: string[] = [];

  console.log(`PROJECT_ROOT: ${projectDir}`);
  console.log(`GIT: ${signals.git ? 'FOUND' : 'NOT_FOUND'}`);
  console.log(`MANIFESTS: ${signals.manifests.join(', ') || 'NONE'}`);
  console.log(`DIRECTORIES: ${signals.directories.join(', ') || 'NONE'}`);
  const aiStatus = aiDirectoryExists ? 'READY' : options.dryRun ? 'WOULD_CREATE' : 'CREATED';
  console.log(`AI_CONFIG_DIR: ${aiDirectory} (${aiStatus})`);
  console.log(`SKILL_AGENTS: ${options.agent}`);
  const groups = new Set(dependencies.map(dependency => dependency.group));
  const unknownGroups = [...options.companions].filter(group => !groups.has(group));
  if (unknownGroups.length > 0) throw new Error(`unknown companion groups: ${unknownGroups.join(', ')}`);
  console.log(`COMPANION_GROUPS: ${[...groups].join(', ')}`);
  console.log(`SELECTED_COMPANIONS: ${[...options.companions].join(', ') || 'NONE'}`);

  for (const dependency of dependencies) {
    if (!options.companions.has(dependency.group)) {
      console.log(`SKILL: ${dependency.name} AVAILABLE (${dependency.group}; used by ${dependency.usedBy.join(', ')})`);
      continue;
    }

    const existingRoot = installedAt(dependency.name, projectDir);
    if (existingRoot) {
      if (options.refresh) {
        if (options.dryRun) {
          console.log(`SKILL: ${dependency.name} WOULD_REFRESH (${existingRoot})`);
          continue;
        }
        console.log(`SKILL: ${dependency.name} REFRESHING (${existingRoot})`);
        const error = refresh(dependency, projectDir);
        if (error) {
          failures.push(`${dependency.name}: ${error}`);
          console.error(`SKILL: ${dependency.name} FAILED (${error})`);
          continue;
        }
      }
      console.log(`SKILL: ${dependency.name} READY (${existingRoot}; used by ${dependency.usedBy.join(', ')})`);
      continue;
    }

    if (options.dryRun) {
      console.log(`SKILL: ${dependency.name} WOULD_INSTALL (${dependency.source}; used by ${dependency.usedBy.join(', ')})`);
      continue;
    }

    console.log(`SKILL: ${dependency.name} INSTALLING (${dependency.source})`);
    const error = install(dependency, options, projectDir);
    const installedRoot = installedAt(dependency.name, projectDir);
    if (error || !installedRoot) {
      const reason = error || 'SKILL.md not found in the project skill directories';
      failures.push(`${dependency.name}: ${reason}`);
      console.error(`SKILL: ${dependency.name} FAILED (${reason})`);
    } else {
      console.log(`SKILL: ${dependency.name} READY (${installedRoot})`);
    }
  }

  const lockfile = join(projectDir, 'skills-lock.json');
  if (options.companions.size > 0) {
    const lockStatus = existsSync(lockfile) ? 'READY' : options.dryRun ? 'WOULD_CREATE' : 'MISSING';
    console.log(`SKILLS_LOCK: ${lockfile} (${lockStatus})`);
    if (!options.dryRun && !existsSync(lockfile)) failures.push('skills-lock.json: missing after companion installation');
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
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  console.log('Status: NEEDS_SETUP');
  process.exitCode = 1;
}
