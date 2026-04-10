import assert from 'node:assert';

import pwhash from './index.mjs';

assert.equal(typeof pwhash, 'string');
assert.equal(pwhash.length, 98);

console.info('+OK basics tests passed.');
