const ip = require('ip');

const pkg = require('../../../package.json');

const onHealthCheck = () => new Promise((resolve) => {
  const health = {
    datetime: new Date(),
    service: pkg.name,
    version: pkg.version,
    ip: ip.address(),
    container: process.env.HOSTNAME
  };

  resolve(health);
});

module.exports = { onHealthCheck };
