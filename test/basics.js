/* -*- tab-width: 2 -*- */
'use strict';

const assert = require('assert');
const pwhash = require('..');

assert.equal(typeof pwhash, 'string');
assert.equal(pwhash.length, 98);

console.info('+OK basics tests passed.');
