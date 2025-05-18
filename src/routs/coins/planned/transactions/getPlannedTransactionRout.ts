import { NO_ACCESS_CODE_ERROR } from '../../../../constants';
import { CoinPlannedTransaction } from '../../../../database/models';
import {
  FastifyType,
  ResponceType,
  ResponseErrorType,
} from '../../../../types';

export const getPlannedTransactionRout: any = async (fastify: FastifyType) => {
  fastify.get<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
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
              data: { $ref: 'CoinPlannedTransaction' },
            },
            required: ['status', 'data'],
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

      const transaction = await CoinPlannedTransaction.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!transaction) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'transactionNotFound',
        };
        reply.code(240).send(responce);
        return;
      }

      const responce: ResponceType = {
        status: 'ok',
        data: transaction,
      };
      reply.send(responce);
    }
  );
};
