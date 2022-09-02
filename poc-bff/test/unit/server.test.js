const { assert } = require('chai');
const server = require('../../lib/infra/server/index');

describe('Server unit tests:', () => {
  it('Should return an error', async () => {
    await server.start();
    await server.stop();

    try {
      await server.stop();
      assert.fail('Client should not return consumer');
    } catch (error) {
      assert.exists(error);
    }
  });
});
