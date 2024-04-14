import { FastifyType, ResponceType } from '../../../types';
import { upload } from '../../../';

declare module 'fastify' {
  interface FastifyRequest {
    file: any;
  }
}

export const adminFileRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post(
    '/createPublic',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: { $ref: 'File' },
            },
          },
        },
      },
      preHandler: upload.single('file'),
    },
    async (request, reply) => {
      if (!request.user?.id) {
        throw new Error("has't user data");
      }
      const file = await fastify.controls.files.create({
        userId: request.user.id,
        isPublic: true,
        ...request.file,
      });
      const responce: ResponceType = {
        status: 'ok',
        data: file,
      };
      reply.send(responce);
    }
  );
};
