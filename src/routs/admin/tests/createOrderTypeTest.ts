import { FastifyInstance } from 'fastify';
import { AUTH_ADMIN_TEST, CREATE_ORDER_TYPE_BODY_DATA } from './constants';
import { checkOrderTypeType } from './checkOrderTypeType';

export const createOrderTypeTest = async (
  fastify: FastifyInstance
): Promise<number> => {
  const createResponse = await fastify.inject({
    method: 'POST',
    url: '/api/admin/orderTypes',
    body: CREATE_ORDER_TYPE_BODY_DATA,
    headers: {
      authorization: AUTH_ADMIN_TEST,
    },
  });
  const createData = createResponse.json();
  expect(createData?.status).toEqual('ok');
  checkOrderTypeType(createData.data, CREATE_ORDER_TYPE_BODY_DATA);
  return createData.data.id;
};
