/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
const getPageRule = require('../../infra/client/poc-strapi/get-page-rule');

const resolvers = {
  Query: {
    getPageRule: async (_, {}) => getPageRule()
  }
};

module.exports = resolvers;
