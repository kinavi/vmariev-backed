import { ICreateTaskData } from '../../../../controllers/TasksController/types';
import { FastifyType, ResponceType } from '../../../../types';

export const taskRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{ Body: ICreateTaskData }>(
    '/',
    {
      schema: {
        tags: ['Time'],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['name'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Task',
              },
            },
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
        body: { description, name },
      } = request;

      const result = await fastify.controls.tasks.create({
        description,
        name,
        userId: request.user.id!,
      });
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.put<{
    Body: Pick<ICreateTaskData, 'description' | 'name'> & { id: number };
  }>(
    '/',
    {
      schema: {
        tags: ['Time'],
        body: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
          },
          required: ['name', 'id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Task',
              },
            },
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
        body: { description, name, id },
      } = request;
      const result = await fastify.controls.tasks.update(id, {
        description,
        name,
      });
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.delete<{
    Querystring: { id: string };
  }>(
    '/',
    {
      schema: {
        tags: ['Time'],
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
      const hasRemove = await fastify.controls.tasks.remove(Number(id));
      const responce: ResponceType = {
        status: hasRemove ? 'ok' : 'error',
      };
      reply.send(responce);
    }
  );

  fastify.get(
    '/',
    {
      schema: {
        tags: ['Time'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'array',
                items: { $ref: 'Task' },
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
      const result = await fastify.controls.tasks.getAll();
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );
  fastify.get<{
    Params: { id: number };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Time'],
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
              data: {
                $ref: 'Task',
              },
            },
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
      const { id } = request.params;
      const result = await fastify.controls.tasks.get(id);
      if (!result) {
        const responce: ResponceType = {
          status: 'error',
          message: 'Something went wrong',
        };
        reply.send(responce);
      } else {
        const responce: ResponceType = {
          status: 'ok',
          data: result,
        };
        reply.send(responce);
      }
    }
  );
};
