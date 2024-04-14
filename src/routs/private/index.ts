import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { privateOrdersRoutes } from './orders';
import { privateFileRouts } from './files';
import { usersRoutes } from './users';

export const privateRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  await tokenVerification(fastify);
  fastify.register(usersRoutes, { prefix: '/users' });
  fastify.register(privateFileRouts, { prefix: '/files' });
  fastify.register(privateOrdersRoutes, { prefix: '/orders' });
};
