const axios = require('axios');

const HTTP_STATUS = require('./http-status');

const MakeRequest = async (url, method, body) => {
  try {
    const options = {
      method,
      url
    };

    if (body) {
      options.data = body;
    }

    const { status, data } = await axios(options);

    return { status, data };
  } catch (err) {
    if (err.response && err.response.status) {
      return { status: err.response.status, data: err.response.data };
    }

    return { status: HTTP_STATUS.internalServerError };
  }
};

module.exports = MakeRequest;
