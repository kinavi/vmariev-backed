import { FastifyType } from '../../../../types';
import { createPlannedTransactionRout } from './createPlannedTransactionRout';
import { getAllPlannedTransactionRout } from './getAllPlannedTransactionRout';
import { getPlannedTransactionRout } from './getPlannedTransactionRout';
import { removePlannedTransactionRout } from './removePlannedTransactionRout';
import { updatePlannedTransactionRout } from './updatePlannedTransactionRout';

export const plannedTransactionsRoutes: any = async (fastify: FastifyType) => {
  fastify.register(createPlannedTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(updatePlannedTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(removePlannedTransactionRout, {
    prefix: '/transactions',
  });
  fastify.register(getAllPlannedTransactionRout, {
    prefix: '/transactions',
  });
    fastify.register(getPlannedTransactionRout, {
      prefix: '/transactions',
    });
};
