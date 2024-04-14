import { NO_ACCESS_CODE_ERROR } from '../constants';
import { FastifyType, UserRole } from '../types';

export const tokenVerification = (fastify: FastifyType) => {
  fastify.decorateRequest('user', null);
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const authorization = request.headers.authorization;
      const token = (authorization as any).replace(/Bearer\s*/gi, '');
      const user = await fastify.controls.users.checkToken(token);
      console.log('user', user);
      if (!user) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      request.user = user;
    } catch (error) {
      throw new Error(NO_ACCESS_CODE_ERROR);
    }
  });
};

export const checkExecutor = (fastify: FastifyType) => {
  fastify.addHook('preHandler', async (request, reply) => {
    const isExecutor = request.user?.role === UserRole.executor;
    const isOwner = request.user?.role === UserRole.owner;
    if (!isExecutor && !isOwner) {
      throw new Error(NO_ACCESS_CODE_ERROR);
    }
  });
};
