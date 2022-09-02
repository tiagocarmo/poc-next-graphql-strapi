const { assert } = require('chai');
const supertest = require('supertest');
const Chance = require('chance');

const server = require('../../../lib/infra/server');
const { HTTP_STATUS } = require('../../../lib/infra/utils');
const nocks = require('../../utils/nocks');
const fixture = require('../../utils/fixture/profile');

describe('Get profiles by query test function', () => {
  let app;
  const chance = new Chance();
  const URL = '/graphql';

  before(async () => {
    app = await server.start();
  });

  after(async () => {
    await server.stop();
  });

  afterEach(() => {
    nocks.cleanAll();
  });

  describe('Cases Success', () => {
    it('Should find Profile when informated query correctly', (done) => {
      const cpf = chance.cpf({ formatted: false });
      const body = `
        query {
          getProfilesByQuery(query: {
            cpf: "${cpf}"
          }) {
            _id
            keys
            created
            portal
            cpf
            consumerId
            status {
              name
              timestamp
            }
            optin
            lastUpdated
            contactInfo {
              type
              name
              mobile
              email
            }
          }
        }
      `;

      const expectedProfile = fixture.create({
        cpf,
        optin: chance.bool(),
        created: chance.date().toISOString(),
        lastUpdated: chance.date().toISOString()
      });
      const query = { cpf };
      const nock = nocks.getProfilesByQuery({ query, profiles: [expectedProfile] });

      try {
        supertest(app)
          .post(URL)
          .set('Content-Type', 'application/json')
          .send({ query: body })
          .expect(HTTP_STATUS.ok)
          .end((err, res) => {
            assert.isNull(err);
            assert.isArray(res.body.data.getProfilesByQuery);
            assert.deepEqual(res.body.data.getProfilesByQuery, [expectedProfile]);
            assert.isTrue(nock.isDone());
            done();
          });
      } catch (error) {
        assert.fail('Query should not return error ', error);
      }
    });
  });

  describe('Cases Fails', () => {
    it('Should return error when not Profile found', (done) => {
      const cpf = chance.cpf({ formatted: false });
      const body = `
        query {
          getProfilesByQuery(query: {
            cpf: "${cpf}"
          }) {
            consumerId
          }
        }
      `;

      const query = { cpf };
      const nock = nocks.getProfilesByQuery({ query, statusCode: HTTP_STATUS.notFound });

      const error = 'Error getting profiles | Query: getActiveProfileByCpf | Failed with status code 404';

      try {
        supertest(app)
          .post(URL)
          .set('Content-Type', 'application/json')
          .send({ query: body })
          .expect(HTTP_STATUS.ok)
          .end((err, res) => {
            assert.isNull(err);
            assert.strictEqual(res.body.errors[0].message, error);
            assert.isTrue(nock.isDone());
            done();
          });
      } catch (e) {
        assert.fail('Query should not return error', e);
      }
    });

    it('Should return error when called bonuz-consumer fails', (done) => {
      const cpf = chance.cpf({ formatted: false });
      const error = 'Error getting profiles | Query: getActiveProfileByCpf | Failed with status code 500';

      const body = `
        query {
          getProfilesByQuery(query: {
            cpf: "${cpf}"
          }) {
            consumerId
          }
        }
      `;

      const query = { cpf };
      const nock = nocks.getProfilesByQuery({ query, errorMessage: new Error(chance.sentence()) });

      try {
        supertest(app)
          .post(URL)
          .set('Content-Type', 'application/json')
          .send({ query: body })
          .expect(HTTP_STATUS.ok)
          .end((err, res) => {
            assert.isNull(err);
            assert.isArray(res.body.errors);
            assert.strictEqual(res.body.errors[0].message, error);
            assert.isTrue(nock.isDone());
            done();
          });
      } catch (e) {
        assert.fail('Query should not return error ', e);
      }
    });
  });
});
