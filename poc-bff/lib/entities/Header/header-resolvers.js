/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
const getHeader = require('../../infra/client/poc-strapi/get-header');

const resolvers = {
  Query: {
    getHeader: async (_, {}) => getHeader()
  }
};

module.exports = resolvers;
