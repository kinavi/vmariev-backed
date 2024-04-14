import { FastifyPluginCallback } from 'fastify';
import { authRoutes } from './auth';
import { offerRoutes } from './offers';
import { NO_ACCESS_CODE_ERROR } from '../constants';
import { adminRouts } from './admin';
import { privateRouts } from './private';

export const routs: FastifyPluginCallback = async (
  fastify,
  options: any,
  done: any
) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (error.message === NO_ACCESS_CODE_ERROR) {
      reply.code(403).send();
    } else {
      throw error;
    }
  });
  fastify.register(offerRoutes, { prefix: '/offers' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(adminRouts, { prefix: '/admin' });
  fastify.register(privateRouts);
};
