import { upload } from '../../../server';
import { FastifyType, ResponceType } from '../../../types';

declare module 'fastify' {
  interface FastifyRequest {
    file: any;
  }
}

export const privateFileRouts: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'File',
              },
            },
          },
          404: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
      preHandler: upload.single('file'),
    },
    async (request, reply) => {
      const file = await fastify.controls.files.create({
        userId: request.user!.id,
        ...request.file,
      });
      if (!file) {
        const responce: ResponceType = {
          status: 'error',
        };
        reply.code(404).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
        data: file,
      };
      reply.send(responce);
    }
  );

  fastify.get<{ Querystring: { id: number } }>(
    '/fileInfo',
    {
      schema: {
        querystring: {
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
                $ref: 'File',
              },
            },
          },
          404: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const id = request.query.id;
      const file = await fastify.controls.files.get(id);
      if (!file) {
        const responce: ResponceType = {
          status: 'error',
        };
        reply.code(404).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
        data: file.model,
      };
      reply.send(responce);
    }
  );

  fastify.get<{ Querystring: { id: number } }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'string',
            format: 'binary',
          },
          404: {
            type: 'object',
            properties: {
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const id = request.query.id;
      const file = await fastify.controls.files.get(id);
      if (!file) {
        const responce: ResponceType = {
          status: 'error',
        };
        reply.code(404).send(responce);
        return;
      }
      reply.type(file.model.mimetype).send(file.raw);
    }
  );
  done();
};
