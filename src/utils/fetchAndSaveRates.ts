import axios from 'axios';
import { FastifyInstance } from 'fastify';
import { CurrencyRubRate } from '../database/models';

require('dotenv').config();

export async function fetchAndSaveRates(fastify: FastifyInstance) {
  if (!process.env.CURENCY_API) {
    return;
  }
  fastify.log.info('[fetchAndSaveRates] Fetching currency rates...');
  try {
    // Пример: получаем курсы с API ЦБ РФ (можешь заменить на свой)
    const response = await axios.get(process.env.CURENCY_API);
    const rates = response.data as {
      Valute: {
        [key: string]: {
          CharCode: string;
          Nominal: number;
          Name: string;
          Value: number;
        };
      };
    };
    //   await CurrencyRubRate.destroy({
    //     where: {},
    //   });
    await Promise.all(
      Object.keys(rates.Valute).map((key) => {
        const _data = rates.Valute[key];
        return CurrencyRubRate.create({
          charCode: _data.CharCode,
          name: _data.Name,
          nominal: _data.Nominal,
          value: _data.Value,
        });
      })
    );

    fastify.log.info('[fetchAndSaveRates] Currency rates saved.');
  } catch (err) {
    fastify.log.error('[fetchAndSaveRates] Error fetching currency data:', err);
  }
}
