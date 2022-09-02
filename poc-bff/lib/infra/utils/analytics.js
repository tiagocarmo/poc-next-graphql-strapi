const interactions = require('@minutrade/bonuz-interactions-client');
const packageJson = require('../../../package.json');

const track = (event, consumerId, data) => {
  interactions.track(event, {
    ...data,
    client: packageJson.name,
    version: packageJson.version,
    distinct_id: consumerId
  });
};

module.exports = { track };
