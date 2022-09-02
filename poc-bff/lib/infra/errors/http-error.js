const { ApolloError } = require('apollo-server-express');

class HttpError extends ApolloError {
  constructor(httpResponse, message) {
    const code = httpResponse.statusMessage
      ? httpResponse.statusMessage.toUpperCase().replace(/\s/, '_')
      : null;

    super(message, code);
  }
}

module.exports = HttpError;
