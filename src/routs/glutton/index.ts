import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { foodsRoutes } from './foods';
import { mealEntriesRoutes } from './mealEntries';
import { userProgramsRoutes } from './userProgram';

export const gluttonRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  await tokenVerification(fastify);
  fastify.register(foodsRoutes, { prefix: '/foods' });
  fastify.register(userProgramsRoutes, { prefix: '/userProgram' });
  fastify.register(mealEntriesRoutes, { prefix: '/mealEntries' });
};
