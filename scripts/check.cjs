const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const expected = new Set([
  'setup', 'shape', 'intake', 'specify', 'build', 'fix', 'review', 'verify', 'finish', 'retro',
  'prototype', 'research', 'deep-design', 'ux-proof', 'wayfinder',
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
console.log(`ok: ${skillFiles.length} public skills`);
