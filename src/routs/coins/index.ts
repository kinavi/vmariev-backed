import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { baseCurrenciesUsersRoutes } from './baseCurrenciesUsersRoutes';
import { currencyRoutes } from './currency';
import { plannedRoutes } from './planned';
import { transactionCategoryRoutes } from './transactionCategoryRoutes';
import { transactionsRoutes } from './transactions';
import { userBalancesRoutes } from './userBalancesRoutes';

export const coinsRouts: any = async (fastify: FastifyType) => {
  await tokenVerification(fastify);

  fastify.register(baseCurrenciesUsersRoutes, {
    prefix: '/baseCurrencySetting',
  });
  fastify.register(transactionCategoryRoutes, {
    prefix: '/transactionCategories',
  });
  fastify.register(userBalancesRoutes);
  fastify.register(transactionsRoutes);
  fastify.register(plannedRoutes);
  fastify.register(currencyRoutes);
};
