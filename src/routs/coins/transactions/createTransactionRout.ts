import { NO_ACCESS_CODE_ERROR } from '../../../constants';
import CoinTransaction, {
  CoinTransactionType,
} from '../../../database/models/coinTransaction';
import { FastifyType, ResponceType } from '../../../types';
import { getUserBalanceModel } from './utils/getUserBalance';
import decreaseBalance from './utils/decreaseBalance';
import increaseBalance from './utils/increaseBalance';

export const createTransactionRout: any = async (fastify: FastifyType) => {
  fastify.post<{
    Body: {
      categoryId?: number;
      title: string;
      description?: string;
      amount: number;
      type: CoinTransactionType;
      currencyCharCode: string;
      date?: string;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Coins'],
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'number', nullable: true },
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
        amount,
        categoryId,
        description,
        title,
        type,
        currencyCharCode,
        date,
      } = request.body;
      const userId = request.user?.id;

      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const transactionModel = await CoinTransaction.build({
        amount,
        categoryId,
        description,
        title,
        type,
        userId,
        currencyCharCode,
        date: date ? new Date(date) : new Date(),
      });

      let userBalance = await getUserBalanceModel(userId);

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

      await Promise.all([userBalance.save(), transactionModel.save()]);
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
