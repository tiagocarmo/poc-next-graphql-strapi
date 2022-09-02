const { makeRequest } = require('../../utils');

const getPageCookie = async () => {
  const url = 'http://localhost:1337/api/page-cookie?populate=*';
  const { data } = await makeRequest(url, 'GET');
  return data?.data?.attributes || [];
};

module.exports = getPageCookie;
