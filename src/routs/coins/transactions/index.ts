import { FastifyType } from '../../../types';
import { createTransactionRout } from './createTransactionRout';
import { getAllTransactionRout } from './getAllTransactionRout';
import { getTransactionRout } from './getTransactionRout';
import { removeTransactionRout } from './removeTransactionRout';
import { updateTransactionRout } from './updateTransactionRout';

export const transactionsRoutes: any = async (fastify: FastifyType) => {
  fastify.register(createTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(updateTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(removeTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(getAllTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(getTransactionRout, {
    prefix: '/transactions',
  });
};
