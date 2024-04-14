import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { taskRoutes } from './time/tasks';
import { tracksRoutes } from './time/tracks';

export const managerRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  await tokenVerification(fastify);
  fastify.register(taskRoutes, { prefix: '/time/tasks' });
  fastify.register(tracksRoutes, { prefix: '/time/tracks' });
};
