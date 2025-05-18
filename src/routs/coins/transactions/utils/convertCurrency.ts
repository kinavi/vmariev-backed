export function convertCurrency({
  amount,
  transactionCurrency,
  baseCurrency,
  currencyRates,
}: {
  amount: number;
  transactionCurrency: string;
  baseCurrency: string;
  currencyRates: {
    [key: string]: {
      value: number;
      nominal: number;
    };
  };
}) {
  if (transactionCurrency === baseCurrency) return amount;

  const from = currencyRates[transactionCurrency];
  const to = currencyRates[baseCurrency];

  if (!from || !to) {
    throw new Error(
      `Не найдены данные по валютам: ${transactionCurrency} или ${baseCurrency}`
    );
  }

  // Переводим в рубли, потом в базовую валюту
  const amountInRub = (from.value / from.nominal) * amount;
  const result = amountInRub / (to.value / to.nominal);
  const formatedResult = result;
  return formatedResult;
}
