import { NO_ACCESS_CODE_ERROR } from '../../../../constants';
import CoinPlannedTransaction, {
  CoinPlannedTransactionStatusType,
} from '../../../../database/models/coinPlannedTransaction';
import { CoinTransactionType } from '../../../../database/models/coinTransaction';
import { FastifyType, ResponceType } from '../../../../types';
import decreaseBalance from '../../transactions/utils/decreaseBalance';
import increaseBalance from '../../transactions/utils/increaseBalance';
import { getUserPlannedBalanceModel } from './utils/getUserPlannedBalanceModel';

export const createPlannedTransactionRout: any = async (
  fastify: FastifyType
) => {
  fastify.post<{
    Body: {
      categoryId?: number;
      title: string;
      description?: string;
      amount: number;
      type: CoinTransactionType;
      currencyCharCode: string;
      date?: string | null;
      status: CoinPlannedTransactionStatusType;
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
            date: { type: 'string', nullable: true },
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
        amount,
        categoryId,
        description,
        title,
        type,
        currencyCharCode,
        date,
        status,
      } = request.body;
      const userId = request.user?.id;

      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const transactionModel = await CoinPlannedTransaction.build({
        amount,
        categoryId: categoryId !== undefined ? categoryId : null,
        description,
        title,
        type,
        userId,
        currencyCharCode,
        date: date ? new Date(date) : null,
        status,
      });

      let userBalance = await getUserPlannedBalanceModel(userId);

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
