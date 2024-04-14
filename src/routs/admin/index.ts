import { FastifyType } from '../../types';
import { adminVerification } from '../../verification/adminVerification';
import { reviewRouts } from './reviewRouts';
import { adminFileRouts } from './files';

export const adminRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  await adminVerification(fastify);
  fastify.register(reviewRouts, { prefix: '/reviews' });
  fastify.register(adminFileRouts, { prefix: '/files' });
};
