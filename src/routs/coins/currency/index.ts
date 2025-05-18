import { FastifyType } from '../../../types';
import { getAvailableCurrencies } from './getAvailableCurrencies';

export const currencyRoutes: any = async (fastify: FastifyType) => {
  fastify.register(getAvailableCurrencies, {
    prefix: '/currencies',
  });
};
