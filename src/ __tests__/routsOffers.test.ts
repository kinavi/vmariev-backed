import { serverInstans } from '../server';
import { FastifyInstance } from 'fastify';
import { EMAIL_MOCK } from './constants';
import { Offer, User } from '../database/models';
import sequelizeConnection from '../database/connection';
import { getOutRemainingTimeCreatingOffer } from './getOutRemainingTimeCreatingOffer';
beforeEach(() => {
  jest.clearAllMocks();
});

// afterAll(() => {
//   return sequelizeConnection.sync({ force: true }); // пересоздание таблиц
// });

// beforeAll(async () => {
//   await Offer.destroy({ where: {}, truncate: true });
// });

describe('Routs: api/offers', () => {
  const fastify: FastifyInstance = serverInstans.fastify;
  beforeAll(() => {
    return Offer.destroy({
      where: {},
    });
  });
  afterAll(() => {
    sequelizeConnection.close();
  });
  test('create offer', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: {
        email: EMAIL_MOCK,
      },
    });
    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(1);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('ok');
    expect(response.statusCode).toEqual(200);
    await Offer.destroy({
      where: {},
    });
  });

  test('try recreate offer, limit time create not expired', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: { email: EMAIL_MOCK },
    });

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: {
        email: EMAIL_MOCK,
      },
    });
    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(3);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('error');
    expect(responseData).toHaveProperty('field');
    expect(responseData.field).toEqual('email');
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toEqual('timeResendingHasNotExpired');
    expect(response.statusCode).toEqual(400);
    await Offer.destroy({
      where: {},
    });
  });

  //

  test('try recreate offer, limit time create expired', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: { email: EMAIL_MOCK },
    });

    const responseWithError = await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: { email: EMAIL_MOCK },
    });

    const responseWithErrorData = responseWithError.json();
    expect(Object.keys(responseWithErrorData)).toHaveLength(3);
    expect(responseWithErrorData).toHaveProperty('status');
    expect(responseWithErrorData.status).toEqual('error');
    expect(responseWithErrorData).toHaveProperty('field');
    expect(responseWithErrorData.field).toEqual('email');
    expect(responseWithErrorData).toHaveProperty('message');
    expect(responseWithErrorData.message).toEqual('timeResendingHasNotExpired');
    expect(responseWithError.statusCode).toEqual(400);

    const offer = await Offer.findOne({
      where: {
        email: EMAIL_MOCK,
      },
    });

    const deltaTime = offer ? getOutRemainingTimeCreatingOffer(offer) : 0;
    await new Promise((resolve) => setTimeout(resolve, deltaTime));

    const response = await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: { email: EMAIL_MOCK },
    });

    const responseData = response.json();
    expect(response.statusCode).toEqual(200);
    expect(Object.keys(responseData)).toHaveLength(1);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('ok');
    await Offer.destroy({
      where: {},
    });
  }, 10000);
});
