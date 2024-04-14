import { FastifyType, ResponceType } from '../../../types';

export const reviewRouts: any = (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  const {
    controls: { reviews },
  } = fastify;
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                type: 'array',
                items: { $ref: 'Review' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const result = await reviews.getAll(false);
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(responce);
    }
  );

  fastify.get<{
    Params: { id: number };
  }>(
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
                $ref: 'Review',
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await reviews.get(id, false);
      const responce: ResponceType = {
        status: result ? 'ok' : 'error',
        data: result,
      };
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(responce);
    }
  );

  fastify.post<{
    Body: {
      userId: number | null;
      text: string;
      orderId: number | null;
      login: string;
      isActive: boolean;
      subjectId: number;
    };
  }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['text', 'subjectId'],
          properties: {
            userId: {
              type: 'number',
            },
            text: {
              type: 'string',
            },
            login: {
              type: 'string',
            },
            orderId: {
              type: 'number',
            },
            isActive: {
              type: 'boolean',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Review',
                nullable: true,
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { isActive, login, orderId, subjectId, text, userId } =
        request.body;
      const review = await reviews.create({
        isActive,
        login,
        text,
        userId,
      });
      const responce: ResponceType = {
        status: 'ok',
        data: review,
      };
      reply.send(responce);
    }
  );

  fastify.put<{
    Body: {
      id: number;
      text: string;
      login: string;
      isActive: boolean;
      subjectId: number;
      userId: number | null;
    };
  }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['id', 'text', 'subjectId'],
          properties: {
            id: {
              type: 'number',
            },
            userId: {
              type: 'number',
            },
            text: {
              type: 'string',
            },
            login: {
              type: 'string',
            },
            orderId: {
              type: 'number',
            },
            isActive: {
              type: 'boolean',
            },
            subjectId: {
              type: 'number',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Review',
                nullable: true,
              },
            },
            required: ['status'],
          },
        },
      },
    },
    async (request, reply) => {
      const updatedReview = await reviews.update(request.body.id, {
        isActive: request.body.isActive,
        login: request.body.login,
        text: request.body.text,
        userId: request.body.userId || null,
      });
      const responce: ResponceType = {
        status: updatedReview ? 'ok' : 'error',
        data: updatedReview ? updatedReview : null,
      };
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(responce);
    }
  );

  fastify.delete<{
    Querystring: { id: string };
  }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              type: 'number',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.query;
      const hasRemove = await reviews.remove(Number(id));
      const responce: ResponceType = {
        status: hasRemove ? 'ok' : 'error',
      };
      reply
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(responce);
    }
  );
  done();
};
