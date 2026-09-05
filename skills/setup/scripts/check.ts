import { accessSync, constants, existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

type Options = {
  projectDir: string;
  requireSetup: boolean;
};

type DomainExpert = {
  name: string;
  path: string;
  slug: string;
  sources: string[];
};

function usage(): void {
  console.log('Usage: bun check.ts [--project-dir <path>] [--require-setup]');
  console.log('   or: node --experimental-strip-types check.ts [--project-dir <path>] [--require-setup]');
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    projectDir: process.cwd(),
    requireSetup: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--project-dir' || argument === '-p') {
      options.projectDir = argv[++index];
    } else if (argument === '--require-setup') {
      options.requireSetup = true;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isInside(root: string, candidate: string): boolean {
  const pathFromRoot = relative(root, candidate);
  return pathFromRoot === ''
    || (pathFromRoot !== '..' && !pathFromRoot.startsWith(`..${sep}`) && !isAbsolute(pathFromRoot));
}

function projectPath(projectDir: string, value: string): string {
  if (isAbsolute(value)) throw new Error(`path must be project-relative: ${value}`);
  const candidate = resolve(projectDir, value);
  if (!isInside(projectDir, candidate)) throw new Error(`path must stay inside project: ${value}`);
  let existingPath = candidate;
  while (!existsSync(existingPath) && existingPath !== projectDir) existingPath = dirname(existingPath);
  if (!isInside(projectDir, realpathSync(existingPath))) {
    throw new Error(`path resolves outside project: ${value}`);
  }
  return candidate;
}

function readablePath(path: string, file = false): boolean {
  try {
    if (file && !statSync(path).isFile()) return false;
    accessSync(path, constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function readSetupConfig(configPath: string): Record<string, unknown> {
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8')) as unknown;
    if (!isRecord(config)) throw new Error('must contain a JSON object');
    return config;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${configPath}: ${message}`);
  }
}

function parseDomainExpert(value: unknown): DomainExpert {
  if (!isRecord(value)) throw new Error('each domain expert must be an object');

  const { name, path, slug, sources } = value;
  if (typeof name !== 'string' || !name.trim() || typeof path !== 'string' || !path.trim()
    || typeof slug !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(slug)
    || !Array.isArray(sources) || sources.length === 0
    || sources.some(source => typeof source !== 'string' || !source.trim())) {
    throw new Error('each domain expert must include name, slug, path, and source paths');
  }

  return { name, path, slug, sources: sources as string[] };
}

function configuredDescriptor(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0 && value.every(configuredDescriptor);
  if (!isRecord(value)) return false;
  const entries = Object.entries(value);
  return entries.length > 0
    && entries.every(([name, descriptor]) => name.trim() && configuredDescriptor(descriptor));
}

function configuredEntries(config: Record<string, unknown>, key: string): number {
  const value = config[key];
  if (!isRecord(value)) throw new Error(`${key} must be an object`);
  for (const [name, descriptor] of Object.entries(value)) {
    if (!name.trim() || !configuredDescriptor(descriptor)) {
      throw new Error(`${key} contains an empty or invalid descriptor`);
    }
  }
  return Object.keys(value).length;
}

function configuredCommands(config: Record<string, unknown>): { feedback: number; validation: number } {
  const value = config.commands;
  if (!isRecord(value)) throw new Error('commands must be an object');
  const { feedback, validation } = value;
  if (!Array.isArray(validation) || validation.length === 0
    || validation.some(command => typeof command !== 'string' || !command.trim())) {
    throw new Error('commands.validation must be a non-empty string array');
  }
  if (feedback !== undefined && (!Array.isArray(feedback)
    || feedback.some(command => typeof command !== 'string' || !command.trim()))) {
    throw new Error('commands.feedback must be a string array');
  }
  return { validation: validation.length, feedback: Array.isArray(feedback) ? feedback.length : 0 };
}

function configuredPaths(config: Record<string, unknown>, projectDir: string): number {
  const value = config.paths;
  if (!isRecord(value)) throw new Error('paths must be an object');
  const required = ['briefs', 'specs', 'research', 'work'];
  for (const key of required) {
    const path = value[key];
    if (typeof path !== 'string' || !path.trim()) throw new Error(`paths.${key} must be a path`);
    projectPath(projectDir, path);
  }
  return required.length;
}

function domainExperts(config: Record<string, unknown>): DomainExpert[] {
  const value = config.domain_experts;
  if (value === undefined) {
    const legacy = config.domain_expert;
    if (legacy === undefined || legacy === null) return [];
    return [parseDomainExpert(legacy)];
  }
  if (value === null) return [];
  if (!Array.isArray(value)) throw new Error('domain_experts must be an array');
  return value.map(parseDomainExpert);
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const projectPathInput = resolve(options.projectDir);
  if (!existsSync(projectPathInput) || !statSync(projectPathInput).isDirectory()) {
    throw new Error(`project directory not found: ${projectPathInput}`);
  }
  const projectDir = realpathSync(projectPathInput);
  if (!existsSync(projectDir) || !statSync(projectDir).isDirectory()) {
    throw new Error(`project directory not found: ${projectDir}`);
  }

  const failures: string[] = [];
  const aiDirectory = join(projectDir, '.ai');
  const configPath = join(aiDirectory, 'skills.json');
  const aiDirectoryExists = existsSync(aiDirectory);
  const aiDirectoryReady = aiDirectoryExists && statSync(aiDirectory).isDirectory();
  const configExists = existsSync(configPath);
  let config: Record<string, unknown> | null = null;

  console.log(`PROJECT_ROOT: ${projectDir}`);
  console.log(`GIT: ${existsSync(join(projectDir, '.git')) ? 'FOUND' : 'NOT_FOUND'}`);
  console.log(`AI_CONFIG_DIR: ${aiDirectory} (${aiDirectoryReady ? 'READY' : 'MISSING'})`);

  if (!aiDirectoryReady && aiDirectoryExists) {
    failures.push(`.ai exists but is not a directory: ${aiDirectory}`);
  } else if (aiDirectoryReady && !isInside(projectDir, realpathSync(aiDirectory))) {
    failures.push(`.ai resolves outside project: ${aiDirectory}`);
  } else if (configExists) {
    try {
      projectPath(projectDir, relative(projectDir, configPath));
      config = readSetupConfig(configPath);
      console.log(`AI_CONFIG: ${configPath} (VALID)`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.error(`AI_CONFIG: INVALID (${message})`);
    }
  } else {
    console.log(`AI_CONFIG: ${configPath} (${options.requireSetup ? 'MISSING' : 'NOT_CONFIGURED'})`);
    if (options.requireSetup) failures.push(`missing setup config: ${configPath}`);
  }

  if (config) {
    try {
      if (config.version !== 1) throw new Error('version must be 1');
      const commandCount = configuredCommands(config);
      const providerCount = configuredEntries(config, 'providers');
      const pathCount = configuredPaths(config, projectDir);
      console.log(`COMMANDS: validation=${commandCount.validation}, feedback=${commandCount.feedback}`);
      console.log(`PROVIDERS: ${providerCount || 'NONE'}`);
      console.log(`PATHS: ${pathCount}`);
      const experts = domainExperts(config);
      if (experts.length === 0) {
        console.log('DOMAIN_EXPERTS: NONE');
      }
      for (const expert of experts) {
        let expertPath: string;
        try {
          expertPath = projectPath(projectDir, expert.path);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`domain expert ${expert.name}: ${message}`);
          console.error(`DOMAIN_EXPERT: INVALID (${message})`);
          continue;
        }
        let skillPath = join(expertPath, 'SKILL.md');
        let skillReady = false;
        try {
          skillPath = projectPath(projectDir, skillPath);
          skillReady = readablePath(skillPath, true);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : String(error);
          failures.push(`domain expert ${expert.name}: ${message}`);
        }
        if (!skillReady) failures.push(`domain expert skill not found or unreadable: ${skillPath}`);
        let sourcesReady = true;
        for (const source of expert.sources) {
          try {
            const sourcePath = projectPath(projectDir, source);
            if (!readablePath(sourcePath)) {
              sourcesReady = false;
              failures.push(`domain expert source not found or unreadable: ${sourcePath}`);
            }
          } catch (error: unknown) {
            sourcesReady = false;
            const message = error instanceof Error ? error.message : String(error);
            failures.push(`domain expert ${expert.name}: ${message}`);
          }
        }
        console.log(`DOMAIN_EXPERT: ${expert.name} -> ${expertPath} (${skillReady && sourcesReady ? 'READY' : 'MISSING'})`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.error(`DOMAIN_EXPERT: INVALID (${message})`);
    }
  } else if (options.requireSetup) {
    console.log('DOMAIN_EXPERT: NOT_CHECKED');
  }

  if (failures.length > 0) {
    console.error(`Open: ${failures.join('; ')}`);
    console.log('Status: NEEDS_SETUP');
    process.exitCode = 1;
  } else if (!config) {
    console.log('Status: NOT_CONFIGURED');
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
