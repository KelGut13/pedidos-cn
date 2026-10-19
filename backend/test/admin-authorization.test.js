const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

for (const [role, allowed] of [[1, true], [2, false], [null, false]]) {
  test(`administrator access for stored role ${role}`, async () => {
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../middleware/auth.js'), 'utf8'), {
      module,
      exports: module.exports,
      process: { env: { JWT_SECRET: 'test-only-key' } },
      console: { error() {} },
      require(name) {
        if (name === 'jsonwebtoken') return { verify: () => ({ userId: 7, rol: 1 }) };
        if (name === '../config/database') return { pool: {
          execute: async () => [[{ ID_usuario: 7, ID_rol: role }]]
        } };
        throw new Error(name);
      }
    });
    let status;
    let nextCalled = false;
    const res = { status(value) { status = value; return this; }, json() {} };
    await module.exports.authenticateAdmin({ headers: { authorization: 'Bearer test-token' } }, res,
      () => { nextCalled = true; });
    assert.equal(nextCalled, allowed);
    assert.equal(status, allowed ? undefined : 403);
  });
}
