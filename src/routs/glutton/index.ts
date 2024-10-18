import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { foodsRoutes } from './foods';
import { userProgramsRoutes } from './userProgram';

export const gluttonRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  await tokenVerification(fastify);
  fastify.register(foodsRoutes, { prefix: '/foods' });
  fastify.register(userProgramsRoutes, { prefix: '/userPrograms' });
};
