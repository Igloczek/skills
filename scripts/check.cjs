const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const expected = new Set([
  'setup', 'shape', 'intake', 'specify', 'build', 'fix', 'review', 'verify', 'finish', 'retro',
  'prototype', 'research', 'deep-design', 'ux-proof', 'wayfinder',
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
assert(fs.existsSync(domainReference), 'missing domain expert reference');
assert(fs.existsSync(domainGuide), 'missing domain expert guide');
assert(fs.existsSync(setupScript), 'missing setup initializer');
assert(fs.existsSync(externalManifest), 'missing external skill manifest');
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
const setupText = fs.readFileSync(path.join(root, 'skills', 'setup', 'SKILL.md'), 'utf8');
const setupScriptText = fs.readFileSync(setupScript, 'utf8');
assert(setupText.includes('scripts/init.cjs'), 'setup does not use the initializer');
assert(setupScriptText.includes("process.env.SKILLS_AGENT || '*'"), 'initializer must default to all agents');
assert(!setupScriptText.includes('--global'), 'initializer must remain project-scoped');
for (const skill of expected) {
  assert(readme.includes(`\`${skill}\``), `missing README skill entry: ${skill}`);
}
assert(readme.includes('```mermaid'), 'missing README workflow graph');
assert(readme.includes('## Setup (once per repository)'), 'missing setup graph section');
assert(readme.includes('domain-expert<br/>project-local only'), 'missing local domain expert branch');
assert(readme.includes('These are installed dependencies, not just references.'), 'missing installed companion statement');
assert(readme.includes("--agent '*' --yes"), 'README must install for all project agents');
assert(!readme.includes('--global'), 'README must not install globally');
assert(!readme.includes('--agent codex'), 'README must not target Codex only');
execFileSync(process.execPath, [setupScript, '--dry-run', '--project-dir', root, '--agent', '*'], { stdio: 'ignore' });
console.log(`ok: ${skillFiles.length} public skills`);
