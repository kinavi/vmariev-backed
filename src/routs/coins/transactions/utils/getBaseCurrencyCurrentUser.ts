import { BaseCurrencyUser } from '../../../../database/models';

require('dotenv').config();

export const getBaseCurrencyCurrentUserModel = async (userId: number) => {
  if (!process.env.DEFAULT_CURENCY) {
    throw new Error('DEFAULT_CURENCY not set');
  }

  const [baseCurrencyCurrentUser] = await BaseCurrencyUser.findOrCreate({
    where: {
      userId,
    },
    defaults: {
      currencyCharCode: process.env.DEFAULT_CURENCY,
      userId,
    },
  });

  return baseCurrencyCurrentUser;
};
