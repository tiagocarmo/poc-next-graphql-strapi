/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
const getPageCookie = require('../../infra/client/poc-strapi/get-page-cookie');

const resolvers = {
  Query: {
    getPageCookie: async (_, {}) => getPageCookie()
  }
};

module.exports = resolvers;
