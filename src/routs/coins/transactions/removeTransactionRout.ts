import { NO_ACCESS_CODE_ERROR } from '../../../constants';
import { CoinTransaction } from '../../../database/models';
import { CoinTransactionType } from '../../../database/models/coinTransaction';
import { FastifyType, ResponceType, ResponseErrorType } from '../../../types';
import decreaseBalance from './utils/decreaseBalance';
import { getUserBalanceModel } from './utils/getUserBalance';
import increaseBalance from './utils/increaseBalance';

export const removeTransactionRout: any = async (fastify: FastifyType) => {
  fastify.delete<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Coins'],
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
              data: {
                type: 'object',
                properties: {
                  balance: {
                    $ref: 'UserBalance',
                  },
                },
                required: ['balance'],
              },
            },
            required: ['status', 'data'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: {
                type: 'string',
                enum: ['canNotRemove', 'transactionNotFound'],
              },
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

      const transactionModel = await CoinTransaction.findOne({
        where: {
          id,
        },
      });

      if (!transactionModel) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'transactionNotFound',
        };
        reply.code(240).send(responce);
        return;
      }

      let userBalance = await getUserBalanceModel(userId);

      // Отменяем старую тразакцию
      switch (transactionModel.type) {
        case CoinTransactionType.expense: {
          userBalance = await increaseBalance(
            fastify,
            userId,
            transactionModel,
            userBalance
          );
          break;
        }
        case CoinTransactionType.income: {
          userBalance = await decreaseBalance(
            fastify,
            userId,
            transactionModel,
            userBalance
          );
          break;
        }
        case CoinTransactionType.transfer: {
          break;
        }
        default:
          break;
      }

      await transactionModel.destroy();

      const responce: ResponceType = {
        status: 'ok',
        data: {
          balance: userBalance.toJSON(),
        },
      };
      reply.send(responce);
    }
  );
};
