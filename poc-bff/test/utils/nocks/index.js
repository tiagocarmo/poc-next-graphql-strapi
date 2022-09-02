const nock = require('nock');

const { HTTP_STATUS } = require('../../../lib/infra/utils');
const conf = require('../../../lib/infra/conf');

const nocks = {};

nocks.cleanAll = () => {
  nock.cleanAll();
};

nocks.getProfilesByQuery = (options = {}) => {
  const url = conf.get('BONUZ_CONSUMER_URL');
  const path = '/profiles';

  if (options.errorMessage) {
    return nock(url)
      .get(path)
      .query(options.query)
      .replyWithError(options.errorMessage);
  }

  return nock(url)
    .get(path)
    .query(options.query)
    .reply(
      options.statusCode || HTTP_STATUS.ok,
      options.profiles || []
    );
};

module.exports = nocks;
