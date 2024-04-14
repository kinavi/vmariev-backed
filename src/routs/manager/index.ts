import { FastifyType } from '../../types';
import { tokenVerification } from '../../verification/tokenVerification';
import { taskRoutes } from './time/tasks';

export const managerRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  await tokenVerification(fastify);
  fastify.register(taskRoutes, { prefix: '/time/tasks' });
};
