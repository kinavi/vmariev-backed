import { FastifyPluginCallback } from 'fastify';
import { authRoutes } from './auth';
import { offerRoutes } from './offers';
import {
  LOGIN_TIME_OUT_CODE_ERROR,
  NO_ACCESS_CODE_ERROR,
  UNAUTHORIZED_CODE_ERROR,
} from '../constants';
import { adminRouts } from './admin';
import { privateRouts } from './private';
import { managerRouts } from './manager';
import { gluttonRouts } from './glutton';

export const routs: FastifyPluginCallback = async (
  fastify,
  options: any,
  done: any
) => {
  fastify.setErrorHandler((error, request, reply) => {
    switch (true) {
      case error.message === UNAUTHORIZED_CODE_ERROR: {
        reply.code(401).send();
        break;
      }
      case error.message === NO_ACCESS_CODE_ERROR: {
        reply.code(403).send();
        break;
      }
      case error.message === LOGIN_TIME_OUT_CODE_ERROR: {
        reply.code(440).send();
        break;
      }
      default:
        throw error;
    }
  });
  fastify.register(offerRoutes, { prefix: '/offers' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(adminRouts, { prefix: '/admin' });
  fastify.register(managerRouts, { prefix: '/manager' });
  fastify.register(gluttonRouts, { prefix: '/glutton' });
  fastify.register(privateRouts);
};
