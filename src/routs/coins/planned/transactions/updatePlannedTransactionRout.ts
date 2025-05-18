import { NO_ACCESS_CODE_ERROR } from '../../../../constants';
import CoinPlannedTransaction, {
  CoinPlannedTransactionStatusType,
} from '../../../../database/models/coinPlannedTransaction';
import { CoinTransactionType } from '../../../../database/models/coinTransaction';
import {
  FastifyType,
  ResponceType,
  ResponseErrorType,
} from '../../../../types';
import decreaseBalance from '../../transactions/utils/decreaseBalance';
import increaseBalance from '../../transactions/utils/increaseBalance';
import { getUserPlannedBalanceModel } from './utils/getUserPlannedBalanceModel';

export const updatePlannedTransactionRout: any = async (
  fastify: FastifyType
) => {
  fastify.put<{
    Body: {
      id: number;
      categoryId?: number;
      title: string;
      description?: string;
      amount: number;
      type: CoinTransactionType;
      currencyCharCode: string;

      plannedDate?: string;
      status: CoinPlannedTransactionStatusType;
    };
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
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'number' },
            amount: { type: 'number' },
            type: {
              type: 'string',
              enum: [
                CoinTransactionType.expense,
                CoinTransactionType.income,
                CoinTransactionType.transfer,
              ],
            },
            currencyCharCode: { type: 'string' },
            plannedDate: { type: 'string' },
            status: {
              type: 'string',
              enum: [
                CoinPlannedTransactionStatusType.completed,
                CoinPlannedTransactionStatusType.pending,
                CoinPlannedTransactionStatusType.skipped,
              ],
            },
          },
          required: ['title', 'amount', 'type', 'currencyCharCode'],
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
                    $ref: 'UserPlannedBalance',
                  },
                  transaction: {
                    $ref: 'CoinPlannedTransaction',
                  },
                },
                required: ['balance', 'transaction'],
              },
            },
            required: ['status', 'data'],
          },
        },
      },
    },
    async (request, reply) => {
      const {
        params: { id },
        body: {
          amount,
          categoryId,
          description,
          title,
          type,
          currencyCharCode,
        },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const transactionModel = await CoinPlannedTransaction.findOne({
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

      let userBalance = await getUserPlannedBalanceModel(userId);

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

      // Изменяем модель
      transactionModel.amount = amount;
      transactionModel.categoryId = categoryId;
      transactionModel.description = description;
      transactionModel.title = title;
      transactionModel.type = type;
      transactionModel.currencyCharCode = currencyCharCode;

      switch (transactionModel.type) {
        case CoinTransactionType.expense:
          userBalance = await decreaseBalance(
            fastify,
            userId,
            transactionModel,
            userBalance
          );

          break;
        case CoinTransactionType.income:
          userBalance = await increaseBalance(
            fastify,
            userId,
            transactionModel,
            userBalance
          );
          break;
        case CoinTransactionType.transfer:
          break;
        default:
          break;
      }

      await transactionModel.save();
      const responce: ResponceType = {
        status: 'ok',
        data: {
          balance: userBalance.toJSON(),
          transaction: transactionModel.toJSON(),
        },
      };
      reply.send(responce);
    }
  );
};
