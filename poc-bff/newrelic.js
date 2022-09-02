const conf = require('./lib/infra/conf');
const pkg = require('./package.json');

exports.config = {
  app_name: [pkg.name],
  license_key: conf.get('NEWRELIC_KEY'),
  allow_all_headers: true,
  error_collector: {
    enabled: true
  },
  transaction_tracer: {
    enabled: true
  },
  transaction_events: {
    enabled: true
  },
  attributes: {
    enabled: true,
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*'
    ]
  },
  distributed_tracing: {
    enabled: true
  },
  span_events: {
    enabled: true,
    attributes: {
      enabled: true
    }
  },
  logging: {
    enabled: false
  }
};
