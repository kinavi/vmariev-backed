import { FastifyType, ResponceType } from '../../../types';
import { getCurrencyRatesByCurrentDay } from '../transactions/utils/getCurrencyRatesByCurrentDay';

export const getAvailableCurrencies: any = async (fastify: FastifyType) => {
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Coins'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    charCode: { type: 'string' },
                    nominal: { type: 'number' },
                    value: { type: 'number' },
                  },
                  required: ['charCode', 'nominal', 'value'],
                },
              },
            },
            required: ['status', 'data'],
          },
        },
      },
    },
    async (request, reply) => {
      const currencies = await getCurrencyRatesByCurrentDay(fastify);
      const result = Object.keys(currencies).map((key) => ({
        charCode: currencies[key].charCode,
        nominal: currencies[key].nominal,
        value: currencies[key].value,
      }));

      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );
};
