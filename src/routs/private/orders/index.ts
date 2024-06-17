import { NO_ACCESS_CODE_ERROR } from '../../../constants';
import { FastifyType, ResponceType, UserRole } from '../../../types';

export const privateOrdersRoutes: any = async (
  fastify: FastifyType,
  options: any
) => {
  fastify.post<{
    Body: {
      filesIds?: number[];
      topic: string;
      subjectId: number;
      typeId: number;
      minNumberPages?: number;
      maxNumberPages?: number;
      warrantyDays?: number;
      deadline?: string;
      discription?: string;
      price?: number;
    };
  }>(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            deadline: { type: 'string' },
            discription: { type: 'string' },
            price: { type: 'number' },
            filesIds: { type: 'array', items: { type: 'number' } },
          },
          required: ['topic'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                $ref: 'Order',
              },
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
      const { body, user } = request;
      if (user?.role !== UserRole.client) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      // нужно проверить, есть ли выбранные предметы и типы в базе
      const order = await fastify.controls.orders.create({
        customerId: request.user!.id!, // проверяет наличие tokenVerification
        deadline:
          body.deadline !== undefined ? new Date(body.deadline) : undefined,
        discription: body.discription,
        price: body.price || 0,
        topic: body.topic,
      });
      if (!!body.filesIds?.length) {
        Promise.all(
          body.filesIds.map((id) => {
            if (order?.id) {
              return fastify.controls.files.updateOrderId(id, order.id!);
            }
            return Promise.resolve();
          })
        );
      }
      if (!order) {
        const responce: ResponceType = {
          status: 'error',
          message: 'not has order',
        };
        reply.code(240).send(responce);
        return;
      }

      const responce: ResponceType = {
        status: order ? 'ok' : 'error',
        data: order,
      };
      reply.send(responce);
    }
  );

  fastify.get<{ Params: { id: number } }>(
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
                $ref: 'Order',
              },
            },
            required: ['status'],
          },
        },
      },
    },
    async (request, reply) => {
      const {
        params: { id },
      } = request;
      const result = await fastify.controls.orders.get(id);
      const responce: ResponceType = {
        status: 'ok',
        data: result,
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
                items: { $ref: 'Order' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id: userId, role } = request.user!; // проверяет наличие tokenVerification
      // Проверяем имеет ли он доступ к заказу
      if (!userId || !role) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      switch (role) {
        case UserRole.client: {
          const result = await fastify.controls.orders.getByCustomerId(userId);
          const responce: ResponceType = {
            status: 'ok',
            data: result,
          };
          reply.send(responce);
          break;
        }
        case UserRole.owner: {
          const result = await fastify.controls.orders.getAll();
          const responce: ResponceType = {
            status: 'ok',
            data: result,
          };
          reply.send(responce);
          break;
        }
        default:
          throw new Error(NO_ACCESS_CODE_ERROR);
      }
    }
  );
};
