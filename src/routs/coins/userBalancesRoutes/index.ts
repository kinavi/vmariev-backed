import { FastifyType } from '../../../types';
import { getCurrentBalancesRoute } from './getCurrentBalances';

export const userBalancesRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.register(getCurrentBalancesRoute, {
    prefix: '/userBalances',
  });
};
