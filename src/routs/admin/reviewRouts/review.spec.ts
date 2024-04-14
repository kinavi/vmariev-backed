import { build } from '../../../helper';
require('dotenv').config();

const CREATE_BODY_DATA = {
  text: 'test text',
  login: 'login',
  isActive: true,
};

const UPDATE_BODY_DATA = {
  text: 'update update',
  login: 'ogin',
  isActive: false,
};

const AUTH = process.env.AUTH_ADMIN_TEST;

export const checkReviewType = <
  DataType extends {
    id: number;
    user?: null;
    text: string;
    login: string;
    isActive: boolean;
  }
>(
  data: DataType,
  comparisonData: DataType
) => {
  expect(data).toHaveProperty('id');
  expect(typeof data.id).toStrictEqual('number');
  // if (!!data.user) {
  // TODO: Зупскаем проверку по модели пользователя
  // } else {
  // expect(data).not.toHaveProperty('user');
  // }
  expect(data).toHaveProperty('text');
  expect(data.text).toStrictEqual(comparisonData.text);
  expect(data).toHaveProperty('login');
  expect(data.login).toStrictEqual(comparisonData.login);
  expect(data).toHaveProperty('isActive');
  expect(data.isActive).toStrictEqual(comparisonData.isActive);
  // TODO: Зупскаем проверку по модели subject
};

describe('REST api reviews', () => {
  const fastify = build();
  let lastCreateIdReview: number | null = null;
  test('create review', async () => {
    const createResponse = await fastify.inject({
      method: 'POST',
      url: '/api/admin/reviews',
      body: CREATE_BODY_DATA,
      headers: {
        authorization: AUTH,
      },
    });
    const createData = createResponse.json();
    expect(createData?.status).toEqual('ok');
    checkReviewType(createData.data, CREATE_BODY_DATA);
    lastCreateIdReview = createData.data.id;
  });

  test('get review after create', async () => {
    const getResponse = await fastify.inject({
      method: 'GET',
      url: `/api/admin/reviews/${lastCreateIdReview}`,
      headers: {
        authorization: AUTH,
      },
    });
    const getData = getResponse.json();
    expect(getData?.status).toEqual('ok');
    checkReviewType(getData.data, CREATE_BODY_DATA);
  });

  test('update review', async () => {
    const response = await fastify.inject({
      method: 'PUT',
      url: '/api/admin/reviews',
      body: { ...UPDATE_BODY_DATA, id: lastCreateIdReview },
      headers: {
        authorization: AUTH,
      },
    });
    const responseData = response.json();
    console.log('responseData', responseData);
    expect(responseData?.status).toEqual('ok');
    checkReviewType(responseData.data, UPDATE_BODY_DATA);
  });

  test('remove review', async () => {
    const removeResponse = await fastify.inject({
      method: 'DELETE',
      url: `/api/admin/reviews`,
      headers: {
        authorization: AUTH,
      },
      query: {
        id: String(lastCreateIdReview),
      },
    });
    const removeData = removeResponse.json();
    expect(removeData?.status).toEqual('ok');
  });

  test('get review after remove', async () => {
    const getResponse = await fastify.inject({
      method: 'GET',
      url: `/api/admin/reviews/${lastCreateIdReview}`,
      headers: {
        authorization: AUTH,
      },
    });
    const getData = getResponse.json();
    expect(getData?.status).toEqual('error');
  });
});
