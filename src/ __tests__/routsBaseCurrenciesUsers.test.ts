import { serverInstans } from '../server';
import { FastifyInstance } from 'fastify';
import { Offer, User, UserRefreshToken } from '../database/models';
import sequelizeConnection from '../database/connection';
import { getOutRemainingTimeCreatingOffer } from './getOutRemainingTimeCreatingOffer';

describe('Routs: api/coins/baseCurrencySetting', () => {
  const fastify: FastifyInstance = serverInstans.fastify;
  const EMAIL_MOCK = 'test_users_baseCurrencySetting@user.ru';
  const PHONE_MOCK = '777';
  const PASSWORD_MOCK = '123456';
  const LOGIN_MOCK = 'baseCurrencySetting_login_mock';

  afterAll(() => {
    sequelizeConnection.close();
  });

  afterEach(async () => {
    await UserRefreshToken.destroy({
      where: {},
    });
    await User.destroy({
      where: {},
    });
    await Offer.destroy({
      where: {},
    });
  });

  // Изменение базовой валюты
  // Изменение базовой валюты, когда она не было создана
  // Создание базовой валюты, хотя пользователь уже имеет базовую валюты

  test('Создание базовой валюты', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: {
        email: EMAIL_MOCK,
      },
    });
    const offectModel = await Offer.findOne({
      where: {
        email: EMAIL_MOCK,
      },
    });
    const signUpResponse = await fastify.inject({
      method: 'POST',
      url: '/api/auth/signUp',
      body: {
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
        phone: PHONE_MOCK,
        login: LOGIN_MOCK,
        code: offectModel?.code,
      },
    });
    const authData = signUpResponse.json();
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/coins/baseCurrencySetting',
      headers: {
        authorization: 'Bear ' + authData.data.access_token,
      },
      body: {
        currencyCharCode: 'RUS',
      },
    });
    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(2);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('ok');

    expect(responseData).toHaveProperty('data');
    expect(Object.keys(responseData.data)).toHaveLength(1);
  });
});
