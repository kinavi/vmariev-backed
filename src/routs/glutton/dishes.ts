import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { DishStatus } from '../../database/models/dish';
import { FastifyType, ResponceType, ResponseErrorType } from '../../types';

export const dishesRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{
    Body: {
      title: string;
      foods: { foodId: number; weight: number }[];
      status?: DishStatus;
    };
  }>(
    '/saved',
    {
      schema: {
        tags: ['Glutton'],
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            foods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  foodId: { type: 'number' },
                  weight: { type: 'number' },
                },
                required: ['foodId', 'weight'],
              },
            },
            status: {
              type: 'string',
              enum: [DishStatus.ACTIVE, DishStatus.CLOSE],
            },
          },
          required: ['title', 'foods'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Dish',
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
      const body = request.body;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const result = await fastify.controls.glutton.dishes.create({
        ...body,
        userId,
      });
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      console.log('responce', responce);
      reply.send(responce);
    }
  );

  fastify.get<{
    Querystring: { status?: DishStatus };
  }>(
    '/saved',
    {
      schema: {
        tags: ['Glutton'],
        querystring: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: [DishStatus.ACTIVE, DishStatus.CLOSE],
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'array',
                items: { $ref: 'Dish' },
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
      const { status } = request.query;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const food = await fastify.controls.glutton.dishes.getByUser(
        userId,
        status
      );
      const responce: ResponceType = {
        status: 'ok',
        data: food,
      };
      reply.send(responce);
    }
  );

  fastify.get<{ Params: { id: number } }>(
    '/saved/:id',
    {
      schema: {
        tags: ['Glutton'],
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
              status: { type: 'string', enum: ['ok'] },
              data: { $ref: 'Dish' },
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
      const result = await fastify.controls.glutton.dishes.get(id);
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.put<{
    Body: {
      title: string;
      foods: { foodId: number; weight: number }[];
      status?: DishStatus;
    };
    Params: { id: string };
  }>(
    '/saved/:id',
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
            foods: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  foodId: { type: 'number' },
                  weight: { type: 'number' },
                },
                required: ['foodId', 'weight'],
              },
            },
            status: {
              type: 'string',
              enum: [DishStatus.ACTIVE, DishStatus.CLOSE],
            },
          },
          required: ['title', 'foods'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Dish',
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
        body: { foods, title, status },
        params: { id },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const dish = await fastify.controls.glutton.dishes.update(Number(id), {
        title,
        foods,
        status,
      });
      if (!dish) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'dish has not found',
        };
        reply.code(240).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
        data: dish,
      };
      reply.send(responce);
    }
  );

  fastify.delete<{
    Params: { id: string };
  }>(
    '/saved/:id',
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
      const isSuccess = await fastify.controls.glutton.dishes.remove(
        Number(id)
      );
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
};
