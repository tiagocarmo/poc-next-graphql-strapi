const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeResolvers } = require('@graphql-tools/merge');

const array = loadFilesSync(path.join(__dirname, '../../../entities/**/*-resolvers.js'));
const resolvers = mergeResolvers(array);

module.exports = resolvers;
