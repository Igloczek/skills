const assert = require('node:assert/strict');
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
assert(fs.existsSync(domainReference), 'missing domain expert reference');
assert(fs.existsSync(domainGuide), 'missing domain expert guide');
const domainText = fs.readFileSync(domainReference, 'utf8');
assert(domainText.includes('name: domain-expert-{{DOMAIN_ROLE_SLUG}}'), 'missing domain expert template');
for (const skill of ['review-gilfoyle', 'review-ponytail', 'ui-dev']) {
  assert(names.includes(skill), `missing specialist skill: ${skill}`);
}
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
for (const item of ['review-gilfoyle', 'review-ponytail', 'ui-dev', 'domain expert']) {
  assert(readme.includes(item), `missing README specialist entry: ${item}`);
}
console.log(`ok: ${skillFiles.length} public skills`);
