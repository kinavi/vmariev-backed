import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { dishesRoutes } from './dishes';
import { foodsRoutes } from './foods';
import { mealEntriesRoutes } from './mealEntries';
import { userActivityEntriesRoutes } from './userActivityEntries';
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
  fastify.register(dishesRoutes, { prefix: '/dishes' });
  fastify.register(userActivityEntriesRoutes, {
    prefix: '/userActivityEntries',
  });
};
