import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function fail(message: string): never {
  throw new Error(message);
}

function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

function frontmatter(file: string): { name: string; description: string } {
  const body = readFileSync(file, 'utf8');
  const block = body.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
  const name = block?.match(/^name:\s*(.+?)\s*$/m)?.[1]?.trim();
  const description = block?.match(/^description:\s*(.+?)\s*$/m)?.[1]?.trim();
  if (!name || !description) fail(`${file}: missing frontmatter name/description`);
  const version = block?.match(/^version:[ \t]*(\S+)[ \t]*$/m)?.[1];
  if (!version || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    fail(`${file}: missing or invalid frontmatter version (expected MAJOR.MINOR.PATCH)`);
  }
  return { name, description };
}

function main(): void {
  const skillFiles = files(join(root, 'skills')).filter(file => file.endsWith('SKILL.md'));
  const names = new Set<string>();
  for (const file of skillFiles) {
    const { name } = frontmatter(file);
    if (names.has(name)) fail(`${file}: duplicate skill name ${name}`);
    names.add(name);
  }

  if (files(join(root, 'internal')).some(file => file.endsWith('SKILL.md'))) {
    fail('internal docs must not be installable skills');
  }

  const manifestPath = join(root, 'skills', 'setup', 'references', 'external-skills.json');
  if (!existsSync(manifestPath)) fail(`missing external skill manifest: ${manifestPath}`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as unknown;
  if (!Array.isArray(manifest)) fail('external skill manifest must be an array');
  const dependencyNames = new Set<string>();
  for (const dependency of manifest) {
    if (typeof dependency !== 'object' || dependency === null
      || typeof (dependency as { name?: unknown }).name !== 'string'
      || !(dependency as { name: string }).name.trim()
      || typeof (dependency as { source?: unknown }).source !== 'string'
      || !(dependency as { source: string }).source.trim()) {
      fail('external skill manifest contains an invalid entry');
    }
    const name = (dependency as { name: string }).name;
    if (dependencyNames.has(name)) fail(`external skill manifest has duplicate ${name}`);
    dependencyNames.add(name);
  }

  for (const path of [
    'skills/setup/scripts/init.ts',
    'skills/setup/scripts/check.ts',
    'skills/setup/references/domain-expert.md',
    'internal/DOMAIN-EXPERT.md',
  ]) {
    const file = join(root, path);
    if (!existsSync(file) || !statSync(file).isFile()) fail(`missing required file: ${path}`);
  }

  console.log(`ok: ${skillFiles.length} public skills, ${dependencyNames.size} external companions`);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}
