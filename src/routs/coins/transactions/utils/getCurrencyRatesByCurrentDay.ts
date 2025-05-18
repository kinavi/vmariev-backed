import { Op } from 'sequelize';
import { CurrencyRubRate } from '../../../../database/models';
import { fetchAndSaveRates } from '../../../../utils/fetchAndSaveRates';
import { FastifyInstance } from 'fastify';

require('dotenv').config();

export const getCurrencyRatesByCurrentDay = async (
  fastify: FastifyInstance
) => {
  if (!process.env.DEFAULT_CURENCY) {
    throw new Error('DEFAULT_CURENCY not set');
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  let currencyRates = await CurrencyRubRate.findAll({
    where: {
      createdAt: {
        [Op.between]: [startOfToday, endOfToday],
      },
    },
  });

  if (currencyRates.length === 0) {
    await fetchAndSaveRates(fastify);
    currencyRates = await CurrencyRubRate.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfToday, endOfToday],
        },
      },
    });
  }

  return currencyRates.reduce<{
    [key: string]: { value: number; nominal: number; charCode: string };
  }>(
    (acc, item) => {
      const _item = item.toJSON();
      acc[_item.charCode] = _item;
      return acc;
    },
    {
      [process.env.DEFAULT_CURENCY]: {
        charCode: process.env.DEFAULT_CURENCY,
        nominal: 1,
        value: 1,
      },
    }
  );
};
