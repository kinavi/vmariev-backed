import Request from '../../database/models/request';
import { FastifyType, ResponceType, ResponseErrorType } from '../../types';

interface ICreateRequestBody {
  name: string;
  email: string;
  servise: string;
  description: string;
  budget: string;
  deadline: string;
}

export const requestRoutes = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{ Body: ICreateRequestBody }>(
    '/request',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            name: { type: 'string' },
            servise: { type: 'string' },
            description: { type: 'string' },
            budget: { type: 'string' },
            deadline: { type: 'string' },
          },
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
      const clientIp = request.ip;
      const userRequests = await Request.findAll({
        where: {
          clientIp,
        },
      });
      const activeRequest = userRequests.reduce<Request | null>((acc, item) => {
        const currentData = new Date();
        const createDate = new Date(item.createdAt);
        if (currentData.getTime() - createDate.getTime() >= 30000) {
          return item;
        }
        return acc;
      }, null);
      if (activeRequest) {
        const error: ResponseErrorType = {
          status: 'error',
          field: 'email',
          message: 'Email is busy',
        };
        reply.code(240).send(error);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
      };
      reply.send(responce);
    }
  );
};
