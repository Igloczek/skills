import assert from 'node:assert/strict';
import { YAML } from 'bun';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
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

type Skill = {
  body: string;
  file: string;
  name: string;
};

function frontmatter(file: string): { name: string; description: string } {
  const body = readFileSync(file, 'utf8');
  const block = body.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
  const name = block?.match(/^name:\s*(.+?)\s*$/m)?.[1]?.trim();
  const description = block?.match(/^description:\s*(.+?)\s*$/m)?.[1]?.trim();
  if (!name || !description) fail(`${file}: missing frontmatter name/description`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) fail(`${file}: invalid skill name ${name}`);
  if (description.replace(/^['"]|['"]$/g, '').trim().length < 12) {
    fail(`${file}: description is too short`);
  }
  return { name, description };
}

function checkRelativeLinks(skill: Skill): void {
  for (const match of skill.body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '').split('#', 1)[0];
    if (!target || /^(?:[a-z]+:|#|\/)/i.test(target)) continue;
    const path = resolve(dirname(skill.file), target);
    if (!existsSync(path)) fail(`${skill.file}: broken relative link ${target}`);
  }
}

function main(): void {
  const skillFiles = files(join(root, 'skills')).filter(file => file.endsWith('SKILL.md'));
  const names = new Set<string>();
  const skills = new Map<string, Skill>();
  for (const file of skillFiles) {
    const { name } = frontmatter(file);
    if (names.has(name)) fail(`${file}: duplicate skill name ${name}`);
    if (basename(dirname(file)) !== name) fail(`${file}: directory must match skill name ${name}`);
    const body = readFileSync(file, 'utf8');
    if (!/^## Output$/m.test(body)) fail(`${file}: missing Output contract`);
    names.add(name);
    const skill = { body, file, name };
    skills.set(name, skill);
    checkRelativeLinks(skill);
  }

  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  const roster = [...readme.matchAll(/^\| `([a-z0-9-]+)`\s*\|/gm)].map(match => match[1]);
  if (new Set(roster).size !== roster.length) fail('README skill roster contains a duplicate');
  const missingFromReadme = [...names].filter(name => !roster.includes(name));
  const missingFromSkills = roster.filter(name => !names.has(name));
  if (missingFromReadme.length || missingFromSkills.length) {
    fail(`README roster mismatch (missing rows: ${missingFromReadme.join(', ') || 'none'}; missing skills: ${missingFromSkills.join(', ') || 'none'})`);
  }

  const review = skills.get('review');
  if (!review || !review.body.includes('every available review skill')
    || !review.body.includes('Do not select or omit')) {
    fail('review must invoke all available review skills without heuristic selection');
  }
  for (const reviewer of ['review-standard', 'review-gilfoyle', 'review-ponytail']) {
    if (!skills.has(reviewer)) fail(`missing review persona: ${reviewer}`);
    if (!review?.body.includes(`\`${reviewer}\``)) fail(`review does not route ${reviewer}`);
  }

  if (files(join(root, 'internal')).some(file => file.endsWith('SKILL.md'))) {
    fail('internal docs must not be installable skills');
  }

  const workflowSteps = {
    'skills-delivery': ['intake', 'build', 'verify', 'review', 'finish'],
    'skills-discovery': ['intake', 'research', 'design', 'plan'],
    'skills-product': ['intake', 'research', 'design', 'plan', 'deliver', 'verify', 'review', 'finish'],
  };
  for (const [name, expectedSteps] of Object.entries(workflowSteps)) {
    const file = join(root, 'workflows', `${name}.yaml`);
    const workflow: unknown = YAML.parse(readFileSync(file, 'utf8'));
    assert(workflow && typeof workflow === 'object' && 'name' in workflow
      && workflow.name === name && 'steps' in workflow && Array.isArray(workflow.steps)
      && !('skills' in workflow), `${file}: invalid workflow`);
    const stepIds: string[] = [];
    for (const step of workflow.steps as unknown[]) {
      assert(step && typeof step === 'object' && 'id' in step && typeof step.id === 'string'
        && 'skill' in step && typeof step.skill === 'string' && names.has(step.skill)
        && 'prompt' in step && typeof step.prompt === 'string'
        && step.prompt.includes('{{task}}') && step.prompt.includes('CEZ_HANDOFF_FILE')
        && !('command' in step), `${file}: expected a known skill with task and handoff context`);
      if (step.id === 'review' || step.id === 'finish' || step.id === 'deliver'
        || (name === 'skills-product' && step.id === 'verify')) {
        const allowedTools = 'allowedTools' in step ? step.allowedTools : undefined;
        assert(Array.isArray(allowedTools)
          && ['Agent', 'Task', 'TaskOutput'].every(tool => allowedTools.includes(tool)),
        `${file}: ${step.id} must allow independent reviewers, including after repairs`);
      }
      stepIds.push(step.id);
    }
    assert.deepEqual(stepIds, expectedSteps, `${file}: unexpected phase order`);
    assert(readme.includes(`workflows/${name}.yaml`), `${file}: missing README link`);
  }

  const obsoleteManifest = join(root, 'skills', 'setup', 'references', 'external-skills.json');
  if (existsSync(obsoleteManifest)) fail('external skill manifests are not part of this repository; use npx skills');

  for (const path of [
    'skills/setup/scripts/init.ts',
    'skills/setup/scripts/check.ts',
    'skills/setup/references/domain-expert.md',
    'skills/setup/references/skills-config.md',
    'internal/DOMAIN-EXPERT.md',
    'internal/PRIMITIVES.md',
  ]) {
    const file = join(root, path);
    if (!existsSync(file) || !statSync(file).isFile()) fail(`missing required file: ${path}`);
  }

  console.log(`ok: ${skillFiles.length} public skills, review routes verified`);
}

try {
  main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}
