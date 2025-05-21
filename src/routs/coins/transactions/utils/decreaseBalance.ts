import {
  CoinPlannedTransaction,
  CoinTransaction,
  UserBalance,
  UserPlannedBalance,
} from '../../../../database/models';
import { FastifyType } from '../../../../types';
import { convertCurrency } from './convertCurrency';
import { getBaseCurrencyCurrentUserModel } from './getBaseCurrencyCurrentUser';
import { getCurrencyRatesByCurrentDay } from './getCurrencyRatesByCurrentDay';

async function decreaseBalance(
  fastify: FastifyType,
  userId: number,
  newTransaction: CoinPlannedTransaction,
  currentBalanse: UserPlannedBalance
): Promise<UserPlannedBalance>;

async function decreaseBalance(
  fastify: FastifyType,
  userId: number,
  newTransaction: CoinTransaction,
  currentBalanse: UserBalance
): Promise<UserBalance>;

async function decreaseBalance(
  fastify: FastifyType,
  userId: number,
  newTransaction: CoinPlannedTransaction | CoinTransaction,
  currentBalanse: UserPlannedBalance | UserBalance
) {
  const currencyRates = await getCurrencyRatesByCurrentDay(fastify);

  const baseCurrencyCurrentUser = await getBaseCurrencyCurrentUserModel(userId);

  // Сначала конвертируем текущий банас в баззовую валюту
  const _convertedBalaceAmountByCurrentBaseCurrency = convertCurrency({
    amount: currentBalanse.amount,
    baseCurrency: baseCurrencyCurrentUser.currencyCharCode,
    transactionCurrency: currentBalanse.currency,
    currencyRates,
  });

  const _convertedTransactionAmount = convertCurrency({
    amount: newTransaction.amount,
    baseCurrency: baseCurrencyCurrentUser.currencyCharCode,
    transactionCurrency: newTransaction.currencyCharCode,
    currencyRates,
  });

  currentBalanse.currency = baseCurrencyCurrentUser.currencyCharCode;
  const updatedAmount =
    Number(_convertedBalaceAmountByCurrentBaseCurrency) -
    Number(_convertedTransactionAmount);

  currentBalanse.amount = updatedAmount;

  await currentBalanse.save();

  return currentBalanse;
}

export default decreaseBalance;
