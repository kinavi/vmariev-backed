import { FastifyType } from '../../../types';
import { plannedTransactionsRoutes } from './transactions';

export const plannedRoutes: any = async (fastify: FastifyType) => {
  fastify.register(plannedTransactionsRoutes, {
    prefix: '/planned',
  });
};
