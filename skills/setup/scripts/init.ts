import { existsSync, mkdirSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

type Options = {
  dryRun: boolean;
  projectDir: string;
};

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
  console.log('Usage: bun init.ts [--project-dir <path>] [--dry-run]');
  console.log('   or: node --experimental-strip-types init.ts [--project-dir <path>] [--dry-run]');
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    dryRun: false,
    projectDir: process.cwd(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--dry-run') {
      options.dryRun = true;
    } else if (argument === '--project-dir' || argument === '-p') {
      options.projectDir = argv[++index];
    } else if (argument === '--help' || argument === '-h') {
      usage();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  if (!options.projectDir) throw new Error('--project-dir needs a path');
  return options;
}

function existingDirectory(directory: string): boolean {
  try {
    return statSync(directory).isDirectory();
  } catch {
    return false;
  }
}

function isInside(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === ''
    || (pathFromRoot !== '..' && !pathFromRoot.startsWith(`..${sep}`) && !isAbsolute(pathFromRoot));
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

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const projectPath = resolve(options.projectDir);
  if (!existingDirectory(projectPath)) throw new Error(`project directory not found: ${projectPath}`);
  const projectDir = realpathSync(projectPath);

  const aiDirectory = join(projectDir, '.ai');
  const aiDirectoryExists = existsSync(aiDirectory);
  if (aiDirectoryExists && !existingDirectory(aiDirectory)) {
    throw new Error(`.ai exists but is not a directory: ${aiDirectory}`);
  }
  if (aiDirectoryExists && !isInside(projectDir, realpathSync(aiDirectory))) {
    throw new Error(`.ai resolves outside project: ${aiDirectory}`);
  }
  if (!options.dryRun && !aiDirectoryExists) mkdirSync(aiDirectory, { recursive: true });

  const signals = projectSignals(projectDir);
  const aiStatus = aiDirectoryExists ? 'READY' : options.dryRun ? 'WOULD_CREATE' : 'CREATED';
  const configPath = join(aiDirectory, 'skills.json');

  console.log(`PROJECT_ROOT: ${projectDir}`);
  console.log(`GIT: ${signals.git ? 'FOUND' : 'NOT_FOUND'}`);
  console.log(`MANIFESTS: ${signals.manifests.join(', ') || 'NONE'}`);
  console.log(`DIRECTORIES: ${signals.directories.join(', ') || 'NONE'}`);
  console.log(`AI_CONFIG_DIR: ${aiDirectory} (${aiStatus})`);
  console.log(`AI_CONFIG: ${configPath} (${existsSync(configPath) ? 'PRESENT' : 'MISSING'})`);
  console.log('External skills: use npx skills directly; none are managed by setup.');

  console.log(options.dryRun ? 'Status: DRY_RUN' : 'Status: READY');
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  console.log('Status: NEEDS_SETUP');
  process.exitCode = 1;
}
