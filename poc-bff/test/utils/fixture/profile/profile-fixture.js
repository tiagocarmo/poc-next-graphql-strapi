const Chance = require('chance');

const chance = new Chance();

const generateContactInfo = () => ([
  {
    type: 'default',
    name: chance.name(),
    mobile: chance.phone({ mobile: true }),
    email: chance.email()
  }
]);

const generateStatus = (data = {}) => ({
  name: data.name || chance.pickone(['active', 'inactive']),
  timestamp: data.timestamp || chance.date().toISOString()
});

module.exports = (data = {}) => ({
  ...data,
  _id: data._id || chance.guid(),
  consumerId: data.consumerId || chance.hash(),
  cpf: data.cpf || chance.cpf({ formatted: false }),
  portal: data.portal || chance.word({ length: 7 }),
  keys: ['portal', 'cpf'],
  contactInfo: data.contactInfo || generateContactInfo(),
  status: generateStatus(data.status)
});
