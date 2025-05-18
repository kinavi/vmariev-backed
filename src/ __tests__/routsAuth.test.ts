import { serverInstans } from '../server';
import { FastifyInstance } from 'fastify';
import { Offer, User, UserRefreshToken } from '../database/models';
import sequelizeConnection from '../database/connection';
import { getOutRemainingTimeCreatingOffer } from './getOutRemainingTimeCreatingOffer';

var setCookie = require('set-cookie-parser');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Routs: api/auth/signUp', () => {
  const fastify: FastifyInstance = serverInstans.fastify;
  const EMAIL_MOCK = 'test_users@user.ru';
  const PHONE_MOCK = '777';
  const PASSWORD_MOCK = '123456';
  const LOGIN_MOCK = 'login_mock';

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

  test('create, confirm offer and finish registation', async () => {
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
    const signUpResponseData = signUpResponse.json();
    expect(Object.keys(signUpResponseData)).toHaveLength(2);
    expect(signUpResponseData).toHaveProperty('status');
    expect(signUpResponseData.status).toEqual('ok');

    expect(signUpResponseData).toHaveProperty('data');
    expect(Object.keys(signUpResponseData.data)).toHaveLength(3);

    expect(signUpResponseData.data).toHaveProperty('access_token');
    expect(signUpResponseData.data.access_token).not.toBeNull();

    expect(signUpResponseData.data).toHaveProperty('refresh_token');
    expect(signUpResponseData.data.refresh_token).not.toBeNull();

    expect(signUpResponseData.data).toHaveProperty('user');
    expect(Object.keys(signUpResponseData.data.user)).toHaveLength(5);
    expect(signUpResponseData.data.user).toHaveProperty('id');
    expect(signUpResponseData.data.user).toHaveProperty('email');
    expect(signUpResponseData.data.user).toHaveProperty('login');
    expect(signUpResponseData.data.user).toHaveProperty('phone');
    expect(signUpResponseData.data.user).toHaveProperty('role');

    expect(signUpResponse.statusCode).toEqual(200);
  });

  test('cretae offer but email is busy', async () => {
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

    await fastify.inject({
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
    expect(responseData.message).toEqual('errorCreatingRequest');
    expect(response.statusCode).toEqual(240);
  });

  test('registration on not valid code', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: {
        email: EMAIL_MOCK,
      },
    });
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/signUp',
      body: {
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
        phone: PHONE_MOCK,
        login: LOGIN_MOCK,
        code: 123123,
      },
    });

    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(3);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('error');
    expect(responseData).toHaveProperty('field');
    expect(responseData.field).toEqual('code');
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toEqual('offerOrCodeNotValid');
    expect(response.statusCode).toEqual(240);
  });

  test('registration, but user is already registered', async () => {
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
    await fastify.inject({
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
    const response = await fastify.inject({
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

    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(2);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('error');
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toEqual('offerOrCodeNotValid');
    expect(response.statusCode).toEqual(240);
  });

  test('registration, but offer life time is expired', async () => {
    await fastify.inject({
      method: 'POST',
      url: '/api/offers/create',
      body: {
        email: EMAIL_MOCK,
      },
    });
    await Offer.update(
      {
        lifeDate: new Date().toISOString(),
      },
      {
        where: {
          email: EMAIL_MOCK,
        },
      }
    );
    const offer = await Offer.findOne({
      where: {
        email: EMAIL_MOCK,
      },
    });
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/signUp',
      body: {
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
        phone: PHONE_MOCK,
        login: LOGIN_MOCK,
        code: offer?.code,
      },
    });
    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(3);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('error');
    expect(responseData).toHaveProperty('field');
    expect(responseData.field).toEqual('code');
    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toEqual('lifeTimeOfferIsExpired');
    expect(response.statusCode).toEqual(240);
  });

  test('Sign in', async () => {
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
    await fastify.inject({
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
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/signIn',
      body: {
        email: EMAIL_MOCK,
        password: PASSWORD_MOCK,
      },
    });

    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(2);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('ok');

    expect(responseData).toHaveProperty('data');
    expect(Object.keys(responseData.data)).toHaveLength(3);

    expect(responseData.data).toHaveProperty('access_token');
    expect(responseData.data.access_token).not.toBeNull();

    expect(responseData.data).toHaveProperty('refresh_token');
    expect(responseData.data.refresh_token).not.toBeNull();

    expect(responseData.data).toHaveProperty('user');
    expect(Object.keys(responseData.data.user)).toHaveLength(5);
    expect(responseData.data.user).toHaveProperty('id');
    expect(responseData.data.user).toHaveProperty('email');
    expect(responseData.data.user).toHaveProperty('login');
    expect(responseData.data.user).toHaveProperty('phone');
    expect(responseData.data.user).toHaveProperty('role');

    expect(response.statusCode).toEqual(200);
  });

  test('Sign in with not valid password', async () => {
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
    await fastify.inject({
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
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/signIn',
      body: {
        email: EMAIL_MOCK,
        password: 'not_valid',
      },
    });
    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(2);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('error');

    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toEqual('signInError');

    expect(response.statusCode).toEqual(240);
  });

  test('Try sign in unreal user data', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/signIn',
      body: {
        email: 'not_valid',
        password: 'not_valid',
      },
    });
    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(2);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('error');

    expect(responseData).toHaveProperty('message');
    expect(responseData.message).toEqual('signInError');

    expect(response.statusCode).toEqual(240);
  });

  test('Refresh token', async () => {
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
    const signUpResponseData = signUpResponse.json();
    const refresh_token = signUpResponseData.data.refresh_token;
    const cookies: { [key: string]: string } = Object.fromEntries(
      signUpResponse.cookies.map(({ name, value }) => [name, value])
    );
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/auth/refreshToken',
      body: {
        email: EMAIL_MOCK,
        refresh_token,
      },
      cookies,
    });

    expect(response.statusCode).toEqual(200);

    const responseData = response.json();
    expect(Object.keys(responseData)).toHaveLength(2);
    expect(responseData).toHaveProperty('status');
    expect(responseData.status).toEqual('ok');

    expect(responseData).toHaveProperty('data');
    expect(Object.keys(responseData.data)).toHaveLength(3);

    expect(responseData.data).toHaveProperty('access_token');
    expect(responseData.data.access_token).not.toBeNull();

    expect(responseData.data).toHaveProperty('refresh_token');
    expect(responseData.data.refresh_token).not.toBeNull();

    expect(responseData.data).toHaveProperty('user');
    expect(Object.keys(responseData.data.user)).toHaveLength(5);
    expect(responseData.data.user).toHaveProperty('id');
    expect(responseData.data.user).toHaveProperty('email');
    expect(responseData.data.user).toHaveProperty('login');
    expect(responseData.data.user).toHaveProperty('phone');
    expect(responseData.data.user).toHaveProperty('role');
  });
});
