import { FastifyType, ResponceType, ResponseErrorType } from '../../types';
import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { MealEntryType } from '../../database/models/mealEntrie';

export const mealEntriesRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{
    Body: {
      entryId: number;
      weight: number;
      entryType: MealEntryType;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        body: {
          type: 'object',
          properties: {
            entryId: {
              type: 'number',
            },
            weight: {
              type: 'number',
            },
            entryType: {
              type: 'string',
              enum: [MealEntryType.dish, MealEntryType.food],
            },
          },
          required: ['weight', 'entryId', 'entryType'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                oneOf: [{ $ref: 'FoodMealEntry' }, { $ref: 'DishMealEntry' }],
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
      const { entryId: entryId, weight, entryType } = request.body;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const activeUserProgram =
        await fastify.controls.glutton.userProgram.getByUserId(userId);
      if (!activeUserProgram?.id) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'user has not active program',
        };
        reply.code(240).send(responce);
        return;
      }
      const result = await fastify.controls.glutton.mealsEntries.create({
        userId,
        userProgramId: activeUserProgram.id,
        entryId,
        weight,
        entryType,
      });
      if (!result) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'can not create meal entry',
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
                items: {
                  oneOf: [{ $ref: 'FoodMealEntry' }, { $ref: 'DishMealEntry' }],
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
