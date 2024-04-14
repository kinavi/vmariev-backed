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
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            userId: { type: 'number' },
          },
          required: ['name', 'userId'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Task',
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'field', 'message'],
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
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Task',
              },
            },
          },
          400: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'field', 'message'],
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
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                type: 'array',
                items: { $ref: 'Task' },
              },
            },
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
                $ref: 'Task',
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await fastify.controls.tasks.get(id);
      const responce: ResponceType = {
        status: result ? 'ok' : 'error',
        data: result,
      };
      reply.send(responce);
    }
  );
};
