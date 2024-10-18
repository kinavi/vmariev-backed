import { FastifyType, ResponceType, ResponseErrorType } from '../../types';
import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { FoodAttributes } from '../../database/models/food';

export const foodsRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{
    Body: {
      title: string;
      proteins: number;
      fats: number;
      carbohydrates: number;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            proteins: { type: 'number' },
            fats: { type: 'number' },
            carbohydrates: { type: 'number' },
          },
          required: ['title', 'proteins', 'fats', 'carbohydrates'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Food',
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
      const {
        body: { carbohydrates, fats, proteins, title },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const food = await fastify.controls.glutton.food.create(
        {
          carbohydrates,
          fats,
          proteins,
          title,
        },
        userId
      );
      const responce: ResponceType = {
        status: 'ok',
        data: food,
      };
      reply.send(responce);
    }
  );

  fastify.put<{
    Body: Pick<FoodAttributes, 'carbohydrates' | 'fats' | 'proteins' | 'title'>;
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Glutton'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            proteins: { type: 'number' },
            fats: { type: 'number' },
            carbohydrates: { type: 'number' },
          },
          required: ['title', 'proteins', 'fats', 'carbohydrates'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Food',
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
      const {
        body: { carbohydrates, fats, proteins, title },
        params: { id },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const food = await fastify.controls.glutton.food.update(Number(id), {
        carbohydrates,
        fats,
        proteins,
        title,
      });
      if (!food) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'food has not found',
        };
        reply.code(240).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
        data: food,
      };
      reply.send(responce);
    }
  );

  fastify.delete<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Glutton'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
            },
            required: ['status'],
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
      const {
        params: { id },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const isSuccess = await fastify.controls.glutton.food.remove(Number(id));
      if (!isSuccess) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'can not remove',
        };
        reply.code(240).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
      };
      reply.send(responce);
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'array',
                items: { $ref: 'Food' },
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
      const food = await fastify.controls.glutton.food.getByUser(userId);
      const responce: ResponceType = {
        status: 'ok',
        data: food,
      };
      reply.send(responce);
    }
  );
};
