const { makeRequest } = require('../../utils');

const getPageRule = async () => {
  const url = 'http://localhost:1337/api/page-rule?populate=*';
  const { data } = await makeRequest(url, 'GET');
  return data?.data?.attributes || [];
};

module.exports = getPageRule;
