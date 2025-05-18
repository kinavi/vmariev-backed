import { NO_ACCESS_CODE_ERROR } from '../../../../constants';
import {
  BaseCurrencyUser,
  CoinPlannedTransaction,
} from '../../../../database/models';
import { FastifyType, ResponceType } from '../../../../types';

export const getAllPlannedTransactionRout: any = async (
  fastify: FastifyType
) => {
  fastify.get<{
    Querystring: {
      page?: number;
      limit?: number;
    };
  }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: 'CoinPlannedTransaction' },
                  },
                  total: { type: 'number' },
                  page: { type: 'number' },
                  totalPages: { type: 'number' },
                },
                required: ['items', 'total', 'page', 'totalPages'],
              },
            },
            required: ['status', 'data'],
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const { page = 1, limit = 20 } = request.query;

      const offset = (page - 1) * limit;

      const transactions = await CoinPlannedTransaction.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']], // сортировка от последней записи
        where: {
          userId,
        },
      });

      const responce: ResponceType = {
        status: 'ok',
        data: {
          items: transactions.rows,
          total: transactions.count,
          page: Number(page),
          totalPages: Math.ceil(transactions.count / limit),
        },
      };
      reply.send(responce);
    }
  );
};
