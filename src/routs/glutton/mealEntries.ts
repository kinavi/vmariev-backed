import { FastifyType, ResponceType, ResponseErrorType } from '../../types';
import { NO_ACCESS_CODE_ERROR } from '../../constants';

export const mealEntriesRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.get<{ Querystring: { targetDate: string } }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        querystring: {
          type: 'object',
          properties: {
            targetDate: {
              type: 'string',
            },
          },
          required: ['targetDate'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'array',
                items: { $ref: 'MealEntry' },
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
      const { targetDate } = request.query;
      const mealEntries =
        await fastify.controls.glutton.mealsEntries.getByTargerDate(
          userId,
          new Date(targetDate)
        );
      const responce: ResponceType = {
        status: 'ok',
        data: mealEntries,
      };
      reply.send(responce);
    }
  );
};
