const R = require('ramda');
const newrelic = require('newrelic');

const fieldTraceSummary = require('./field-trace-summary');

const errorCount = R.pipe(R.propOr([], 'errors'), R.length);

const apolloNewRelicPlugins = (() => {
  const requestDidStart = (requestContext) => {
    newrelic.setTransactionName(`graphql (${requestContext.request.operationName})`);
    newrelic.addCustomAttribute('gqlQuery', requestContext.request.query);
    newrelic.addCustomAttribute('gqlVars', JSON.stringify(requestContext.request.variables));
  };

  const willSendResponse = (responseContext) => {
    const tracingSummary = R.pipe(
      R.pathOr([], ['extensions', 'tracing']),
      fieldTraceSummary
    )(responseContext);
    newrelic.addCustomAttribute('traceSummary', tracingSummary);
    newrelic.addCustomAttribute('errorCount', errorCount(responseContext.response));
  };

  return {
    requestDidStart,
    willSendResponse
  };
})();

module.exports = apolloNewRelicPlugins;
