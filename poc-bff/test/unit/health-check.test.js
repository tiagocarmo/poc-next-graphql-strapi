const { assert } = require('chai');
const healthCheck = require('../../lib/infra/server/health-check');

describe('health-check unit tests:', () => {
  it('Should return an object', async () => {
    const result = await healthCheck.onHealthCheck();
    assert.isObject(result);
  });
});
