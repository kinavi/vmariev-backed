import { FastifyInstance } from 'fastify';
import {
  CoinPlannedTransaction,
  CoinTransaction,
  User,
  UserBalance,
  UserPlannedBalance,
} from '../database/models';
import { CoinTransactionType } from '../database/models/coinTransaction';
import { convertCurrency } from '../routs/coins/transactions/utils/convertCurrency';
import { getBaseCurrencyCurrentUserModel } from '../routs/coins/transactions/utils/getBaseCurrencyCurrentUser';
import { getCurrencyRatesByCurrentDay } from '../routs/coins/transactions/utils/getCurrencyRatesByCurrentDay';
import { CoinPlannedTransactionStatusType } from '../database/models/coinPlannedTransaction';

async function recalculateBalance(fastify: FastifyInstance) {
  fastify.log.info('[recalculateBalance]: Running');
  const userList = await User.findAll();
  return Promise.all(
    userList.map(async (user) => {
      const baseUserCurrencyModel = await getBaseCurrencyCurrentUserModel(
        user.id
      );

      const currencyRates = await getCurrencyRatesByCurrentDay(fastify);

      // Сначала считаем фактический баланс
      await UserBalance.destroy({
        where: {
          userId: user.id,
        },
      });

      const balance = UserBalance.build({
        currency: baseUserCurrencyModel.currencyCharCode,
        amount: 0,
        userId: user.id,
      });

      const transactions = await CoinTransaction.findAll({
        where: {
          userId: user.id,
        },
      });

      transactions.forEach((transaction) => {
        switch (transaction.type) {
          case CoinTransactionType.expense: {
            const convertedAmount = convertCurrency({
              amount: transaction.amount,
              baseCurrency: baseUserCurrencyModel.currencyCharCode,
              transactionCurrency: transaction.currencyCharCode,
              currencyRates,
            });
            balance.amount -= convertedAmount;
            break;
          }
          case CoinTransactionType.income: {
            const convertedAmount = convertCurrency({
              amount: transaction.amount,
              baseCurrency: baseUserCurrencyModel.currencyCharCode,
              transactionCurrency: transaction.currencyCharCode,
              currencyRates,
            });
            balance.amount += convertedAmount;
            break;
          }
          case CoinTransactionType.transfer:
          default:
            break;
        }
      });

      await balance.save();

      // Потом считаем плановый балан на основание фактического
      await UserPlannedBalance.destroy({
        where: {
          userId: user.id,
        },
      });

      const plannedBalance = UserPlannedBalance.build({
        currency: baseUserCurrencyModel.currencyCharCode,
        amount: 0,
        userId: user.id,
      });

      const plannedTransactions = await CoinPlannedTransaction.findAll({
        where: {
          userId: user.id,
          status: CoinPlannedTransactionStatusType.pending,
        },
      });

      plannedTransactions.forEach((transaction) => {
        switch (transaction.type) {
          case CoinTransactionType.expense: {
            const convertedAmount = convertCurrency({
              amount: transaction.amount,
              baseCurrency: baseUserCurrencyModel.currencyCharCode,
              transactionCurrency: transaction.currencyCharCode,
              currencyRates,
            });
            plannedBalance.amount -= convertedAmount;
            break;
          }
          case CoinTransactionType.income: {
            const convertedAmount = convertCurrency({
              amount: transaction.amount,
              baseCurrency: baseUserCurrencyModel.currencyCharCode,
              transactionCurrency: transaction.currencyCharCode,
              currencyRates,
            });
            plannedBalance.amount += convertedAmount;
            break;
          }
          case CoinTransactionType.transfer:
          default:
            break;
        }
      });

      await plannedBalance.save();
    })
  )
    .then(() => {
      fastify.log.info('[recalculateBalance]: Finish');
    })
    .catch((error) => {
      fastify.log.error('[recalculateBalance]: Error', error);
    });
}

export default recalculateBalance;
