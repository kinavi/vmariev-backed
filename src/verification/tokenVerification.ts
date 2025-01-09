import {
  LOGIN_TIME_OUT_CODE_ERROR,
  NO_ACCESS_CODE_ERROR,
  UNAUTHORIZED_CODE_ERROR,
} from '../constants';
import { FastifyType, UserRole } from '../types';

export const tokenVerification = (fastify: FastifyType) => {
  fastify.addHook('preHandler', async (request, reply) => {
    try {
      const authorization = request.headers.authorization;
      const token = (authorization as any).replace(/Bearer\s*/gi, '');
      const user = await fastify.controls.users.checkAccessToken(token);
      if (!user) {
        throw new Error(UNAUTHORIZED_CODE_ERROR);
      }
      request.user = user;
    } catch (error: any) {
      fastify.log.error(error);
      const name = error['name'];
      switch (name) {
        case 'TokenExpiredError':
          throw new Error(LOGIN_TIME_OUT_CODE_ERROR);
        default:
          throw new Error(UNAUTHORIZED_CODE_ERROR);
      }
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
