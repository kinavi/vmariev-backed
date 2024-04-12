import { FastifyPluginCallback } from 'fastify';

export const routs: FastifyPluginCallback = async (
  fastify,
  options: any,
  done: any
) => {
  fastify.get('/test', (req, rep) => {
    rep.send('api/test');
  });
};
