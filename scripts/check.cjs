const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const expected = new Set([
  'setup', 'shape', 'intake', 'specify', 'build', 'fix', 'review', 'verify', 'finish', 'retro',
  'how', 'why', 'prototype', 'research', 'deep-design', 'ux-proof', 'wayfinder',
  'review-gilfoyle', 'review-ponytail', 'ui-dev',
]);

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}

const skillFiles = files(path.join(root, 'skills')).filter(file => file.endsWith('SKILL.md'));
const names = skillFiles.map(file => {
  const body = fs.readFileSync(file, 'utf8');
  const name = body.match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
  const description = body.match(/^description:\s*["']?(.+?)["']?\s*$/m)?.[1]?.trim();
  assert(name && description, `${file}: missing frontmatter name/description`);
  return name;
});

assert.equal(skillFiles.length, expected.size, 'unexpected skill count');
assert.equal(new Set(names).size, names.length, 'duplicate skill name');
assert.deepEqual(new Set(names), expected, 'skill roster drift');
assert.equal(files(path.join(root, 'internal')).filter(file => file.endsWith('SKILL.md')).length, 0, 'internal docs must not be installable skills');

const domainReference = path.join(root, 'skills', 'setup', 'references', 'domain-expert.md');
const domainGuide = path.join(root, 'internal', 'DOMAIN-EXPERT.md');
const setupScript = path.join(root, 'skills', 'setup', 'scripts', 'init.cjs');
const externalManifest = path.join(root, 'skills', 'setup', 'references', 'external-skills.json');
const agentsFile = path.join(root, 'AGENTS.md');
assert(fs.existsSync(domainReference), 'missing domain expert reference');
assert(fs.existsSync(domainGuide), 'missing domain expert guide');
assert(fs.existsSync(setupScript), 'missing setup initializer');
assert(fs.existsSync(externalManifest), 'missing external skill manifest');
assert(fs.existsSync(agentsFile), 'missing repository AGENTS.md');
const domainText = fs.readFileSync(domainReference, 'utf8');
assert(domainText.includes('name: domain-expert-{{DOMAIN_ROLE_SLUG}}'), 'missing domain expert template');
const externalSkills = JSON.parse(fs.readFileSync(externalManifest, 'utf8'));
assert.equal(externalSkills.length, 4, 'unexpected external skill count');
assert.deepEqual(new Set(externalSkills.map(skill => skill.name)), new Set([
  'gilfoyle', 'ponytail', 'design-taste-frontend', 'make-interfaces-feel-better',
]));
for (const skill of ['review-gilfoyle', 'review-ponytail', 'ui-dev']) {
  assert(names.includes(skill), `missing required skill: ${skill}`);
}
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const agentsText = fs.readFileSync(agentsFile, 'utf8');
const setupText = fs.readFileSync(path.join(root, 'skills', 'setup', 'SKILL.md'), 'utf8');
const setupScriptText = fs.readFileSync(setupScript, 'utf8');
assert(setupText.includes('scripts/init.cjs'), 'setup does not use the initializer');
assert(setupScriptText.includes("process.env.SKILLS_AGENT || '*'"), 'initializer must default to all agents');
assert(!setupScriptText.includes('--global'), 'initializer must remain project-scoped');

function checkLocalMarkdownLinks(file) {
  const body = fs.readFileSync(file, 'utf8');
  for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().replace(/^<|>$/g, '');
    if (!target || target.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
    const localTarget = target.split('#', 1)[0];
    const resolved = path.resolve(path.dirname(file), localTarget);
    assert(resolved === root || resolved.startsWith(`${root}${path.sep}`), `${file}: link escapes repository: ${target}`);
    assert(fs.existsSync(resolved), `${file}: broken local link: ${target}`);
  }
}

for (const file of [...files(path.join(root, 'skills')), ...files(path.join(root, 'internal')), path.join(root, 'README.md'), agentsFile].filter(file => file.endsWith('.md'))) {
  checkLocalMarkdownLinks(file);
}

for (const skill of expected) {
  assert(readme.includes(`\`${skill}\``), `missing README skill entry: ${skill}`);
}
assert(readme.includes('```mermaid'), 'missing README workflow graph');
assert(readme.includes('## Purpose'), 'missing README purpose');
assert(agentsText.includes('## Purpose'), 'missing AGENTS purpose');
assert(agentsText.includes('solo'), 'AGENTS must describe the solo-developer scope');
assert(readme.includes('## Setup (once per repository)'), 'missing setup graph section');
assert(readme.includes('project expert<br/>local only'), 'missing local project expert branch');
assert(readme.includes("--agent '*' --yes"), 'README must install for all project agents');
assert(!readme.includes('--global'), 'README must not install globally');
assert(!readme.includes('--agent codex'), 'README must not target Codex only');
execFileSync(process.execPath, [setupScript, '--dry-run', '--project-dir', root, '--agent', '*'], { stdio: 'ignore' });
console.log(`ok: ${skillFiles.length} public skills`);
