import {
  FastifyType,
  ResponceType,
  ResponseErrorType,
} from '../../../../types';

export const tracksRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{ Body: { taskId: number; limit: number } }>(
    '/start',
    {
      schema: {
        tags: ['Time'],
        body: {
          type: 'object',
          properties: {
            taskId: { type: 'number' },
            limit: { type: 'number' },
          },
          required: ['taskId', 'limit'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'Track',
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
        body: { taskId, limit },
      } = request;
      const runningTasks = await fastify.controls.tasks.getAllRunning(
        request.user.id!
      );
      if (!!runningTasks.length) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'user has running tasks',
          field: 'taskId',
        };
        reply.code(400).send(responce);
        return;
      }
      const result = await fastify.controls.tracks.create({
        dateStart: new Date(),
        taskId,
        limit,
      });
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.put<{ Body: { id: number } }>(
    '/stop',
    {
      schema: {
        tags: ['Time'],
        body: {
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
                $ref: 'Track',
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
        body: { id },
      } = request;
      const targetTrack = await fastify.controls.tracks.get(id);
      if (!targetTrack) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'has not track',
        };
        reply.code(400).send(responce);
        return;
      }
      const result = await fastify.controls.tracks.update(id, {
        dateStop: new Date(),
      });
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.get<{
    Querystring: { taskId: number; startData: string; endData: string };
  }>(
    '/',
    {
      schema: {
        tags: ['Time'],
        querystring: {
          type: 'object',
          required: ['taskId'],
          properties: {
            taskId: {
              type: 'number',
            },
            startData: {
              type: 'string',
            },
            endData: {
              type: 'string',
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
                items: { $ref: 'Track' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const {
        query: { taskId, endData, startData },
      } = request;
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const startOfMonth = startData
        ? new Date(startData)
        : new Date(year, month, 1);
      const endOfMonth = endData
        ? new Date(endData)
        : new Date(year, month + 1, 0);
      const result = await fastify.controls.tracks.getCurrentMonth(
        taskId,
        startOfMonth,
        endOfMonth
      );
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );
};
