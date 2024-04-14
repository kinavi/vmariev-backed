import { build } from '../../../helper';
import { AUTH_CUSTOMER_TESTS } from '../../admin/tests/constants';
import { createOrderTypeTest } from '../../admin/tests/createOrderTypeTest';
import { createSubjectTest } from '../../admin/tests/createSubjectTest';
import { checkCreatedOrderType } from '../tests/checkCreatedOrderType';
import { CREATE_ORDER_BODY_DATA } from '../tests/constants';

describe('create order', () => {
  const fastify = build();
  let lastCreateOrderId: number | null = null;
  let subjectId: number | null = null;
  let typeId: number | null = null;

  test('create subject', async () => {
    subjectId = await createSubjectTest(fastify);
  });

  test('create type', async () => {
    typeId = await createOrderTypeTest(fastify);
  });

  test('create order', async () => {
    const response = await fastify.inject({
      method: 'POST',
      url: '/api/orders',
      body: { ...CREATE_ORDER_BODY_DATA, subjectId, typeId },
      headers: {
        authorization: AUTH_CUSTOMER_TESTS,
      },
    });
    const responseData = response.json();
    expect(responseData?.status).toEqual('ok');
    checkCreatedOrderType(responseData.data, CREATE_ORDER_BODY_DATA);
    lastCreateOrderId = responseData.data.id;
    if (lastCreateOrderId) {
      fastify.controls.orders.remove(lastCreateOrderId);
    }
  });
});
