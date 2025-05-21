import { NO_ACCESS_CODE_ERROR } from '../../../constants';
import CoinTransaction, {
  CoinTransactionType,
} from '../../../database/models/coinTransaction';
import { FastifyType, ResponceType, ResponseErrorType } from '../../../types';
import decreaseBalance from './utils/decreaseBalance';
import { getUserBalanceModel } from './utils/getUserBalance';
import increaseBalance from './utils/increaseBalance';

export const updateTransactionRout: any = async (fastify: FastifyType) => {
  fastify.put<{
    Body: {
      id: number;
      categoryId?: number;
      title: string;
      description?: string;
      amount: number;
      type: CoinTransactionType;
      currencyCharCode: string;
      date: string;
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
            date: { type: 'string' },
          },
          required: ['title', 'amount', 'type', 'currencyCharCode', 'date'],
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
                  transaction: {
                    $ref: 'CoinTransaction',
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
          date,
        },
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

      // Изменяем модель
      transactionModel.amount = amount;
      transactionModel.categoryId = categoryId;
      transactionModel.description = description;
      transactionModel.title = title;
      transactionModel.type = type;
      transactionModel.currencyCharCode = currencyCharCode;
      transactionModel.date = new Date(date);

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

      await userBalance.save();
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
