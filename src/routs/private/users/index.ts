import { IUserAttributes } from '../../../database/models/user';
import { FastifyType, ResponceType } from '../../../types';
declare module 'fastify' {
  interface FastifyRequest {
    // you must reference the interface and not the type
    user: IUserAttributes;
  }
}

export const usersRoutes: any = async (fastify: FastifyType, options: any) => {
  fastify.get<{ Params: { id: number } }>(
    '/:id',
    {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'User',
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const responce: ResponceType = {
        status: 'ok',
        data: request.user,
      };
      reply.send(responce);
    }
  );
};
