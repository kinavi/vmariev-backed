import { ICreateTrackData } from '../../../../controllers/TracksControler/types';
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
  fastify.post<{ Body: { taskId: number } }>(
    '/start',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            taskId: { type: 'number' },
          },
          required: ['taskId'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Track',
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
        body: { taskId },
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
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Track',
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
};
