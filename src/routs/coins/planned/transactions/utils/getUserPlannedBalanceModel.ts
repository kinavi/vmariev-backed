import { UserPlannedBalance } from '../../../../../database/models';

require('dotenv').config();

export const getUserPlannedBalanceModel = async (userId: number) => {
  if (!process.env.DEFAULT_CURENCY) {
    throw new Error('DEFAULT_CURENCY not set');
  }

  const [currentBalanse, isCreated] = await UserPlannedBalance.findOrCreate({
    where: {
      userId,
    },
    defaults: {
      amount: 0,
      currency: process.env.DEFAULT_CURENCY,
      userId,
    },
  });

  return currentBalanse;
};
