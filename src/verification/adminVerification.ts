import {
  NO_ACCESS_CODE_ERROR,
  LOGIN_TIME_OUT_CODE_ERROR,
  UNAUTHORIZED_CODE_ERROR,
} from '../constants';
import { FastifyType, UserRole } from '../types';

export const adminVerification = (fastify: FastifyType) => {
  fastify.decorateRequest('user', null);
  fastify.addHook('preHandler', async (request, reply) => {
    const authorization = request.headers.authorization;
    if (!authorization) {
      throw new Error(UNAUTHORIZED_CODE_ERROR);
    }
    const token = (authorization as any).replace(/Bearer\s*/gi, '');
    const user = await fastify.controls.users.checkAccessToken(token);
    if (!user) {
      throw new Error(UNAUTHORIZED_CODE_ERROR);
    }
    request.user = user;
    if (user?.role !== UserRole.owner) {
      throw new Error(NO_ACCESS_CODE_ERROR);
    }
  });
};
