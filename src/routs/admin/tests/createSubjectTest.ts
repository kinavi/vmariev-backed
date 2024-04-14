import { FastifyInstance } from 'fastify';
import { AUTH_ADMIN_TEST, CREATE_SUBJECT_BODY_DATA } from './constants';
import { checkOrderSubjectType } from './checkOrderSubjectType';

export const createSubjectTest = async (
  fastify: FastifyInstance
): Promise<number> => {
  const result = await fastify.inject({
    method: 'POST',
    url: '/api/admin/orderSubjects',
    body: CREATE_SUBJECT_BODY_DATA,
    headers: {
      authorization: AUTH_ADMIN_TEST,
    },
  });
  const createData = result.json();
  expect(createData?.status).toEqual('ok');
  checkOrderSubjectType(createData.data, CREATE_SUBJECT_BODY_DATA);
  return createData.data.id;
};
