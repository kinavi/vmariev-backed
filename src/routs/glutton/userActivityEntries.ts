import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { FastifyType, ResponceType, ResponseErrorType } from '../../types';

export const userActivityEntriesRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{
    Body: {
      name: string;
      calories: number;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        body: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            calories: {
              type: 'number',
            },
          },
          required: ['name', 'calories'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: { $ref: 'UserActivityEntry' },
            },
            required: ['status', 'data'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const { calories, name } = request.body;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const result = await fastify.controls.glutton.userActivityEntries.create({
        userId,
        calories,
        name,
      });
      if (!result) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'can not create user activity entry',
        };
        reply.code(240).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.get<{ Querystring: { date: string } }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        querystring: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
            },
          },
          required: ['date'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'array',
                items: {
                  $ref: 'UserActivityEntry',
                },
              },
            },
            required: ['status', 'data'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const { date } = request.query;
      const mealEntries =
        await fastify.controls.glutton.userActivityEntries.getByDate(
          userId,
          new Date(date)
        );
      const responce: ResponceType = {
        status: 'ok',
        data: mealEntries,
      };
      reply.send(responce);
    }
  );
};
