const { makeRequest } = require('../../utils');

const getHeader = async () => {
  const url = 'http://localhost:1337/api/header?populate=*,menu,menu.links';
  const { data } = await makeRequest(url, 'GET');
  return data?.data?.attributes || [];
};

module.exports = getHeader;
