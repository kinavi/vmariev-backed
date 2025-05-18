import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { CurrencyRubRate, BaseCurrencyUser } from '../../database/models';
import { FastifyType, ResponceType, ResponseErrorType } from '../../types';
import recalculateBalance from '../../utils/recalculateBalance';
import { getBaseCurrencyCurrentUserModel } from './transactions/utils/getBaseCurrencyCurrentUser';

require('dotenv').config();

export const baseCurrenciesUsersRoutes: any = async (
  fastify: FastifyType,
  options: any
) => {
  fastify.post<{
    Body: {
      currencyCharCode: string;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Coins'],
        body: {
          type: 'object',
          properties: {
            currencyCharCode: { type: 'string' },
          },
          required: ['currencyCharCode'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'BaseCurrencySetting',
              },
            },
            required: ['status', 'data'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: {
                type: 'string',
                enum: ['baseCurrencyIsAlreadyExist', 'currencyIsNotAvailable'],
              },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const hasBaseCurrency =
        await fastify.controls.coins.baseCurrencySetting.get(userId);
      if (hasBaseCurrency) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'baseCurrencyIsAlreadyExist',
        };
        reply.code(240).send(responce);
        return;
      }

      const lastTargetCurrencyRate = await CurrencyRubRate.findOne({
        where: {
          charCode: body.currencyCharCode,
        },
        order: [['createdAt', 'DESC']],
      });

      if (
        !lastTargetCurrencyRate &&
        body.currencyCharCode !== process.env.DEFAULT_CURENCY
      ) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'currencyIsNotAvailable',
        };
        reply.code(240).send(responce);
        return;
      }

      const result = await fastify.controls.coins.baseCurrencySetting.create({
        currencyCharCode: body.currencyCharCode,
        userId,
      });

      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.put<{
    Body: {
      currencyCharCode: string;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Coins'],
        body: {
          type: 'object',
          properties: {
            currencyCharCode: { type: 'string' },
          },
          required: ['currencyCharCode'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'BaseCurrencySetting',
              },
            },
            required: ['status', 'data'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: {
                type: 'string',
                enum: [
                  'baseCurrencyIsNotAlreadyExist',
                  'baseCurrencySettingHasNotFound',
                  'currencyIsNotAvailable',
                ],
              },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const {
        body: { currencyCharCode },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const hasBaseCurrency =
        await fastify.controls.coins.baseCurrencySetting.get(userId);

      if (!hasBaseCurrency) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'baseCurrencyIsNotAlreadyExist',
        };
        reply.code(240).send(responce);
        return;
      }

      const lastTargetCurrencyRate = await CurrencyRubRate.findOne({
        where: {
          charCode: currencyCharCode,
        },
        order: [['createdAt', 'DESC']],
      });

      if (
        !lastTargetCurrencyRate &&
        currencyCharCode !== process.env.DEFAULT_CURENCY
      ) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'currencyIsNotAvailable',
        };
        reply.code(240).send(responce);
        return;
      }

      const result = await fastify.controls.coins.baseCurrencySetting.update(
        currencyCharCode,
        userId
      );
      if (!result) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'baseCurrencySettingHasNotFound',
        };
        reply.code(240).send(responce);
        return;
      }
      await recalculateBalance(fastify);
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );

  fastify.delete(
    '/',
    {
      schema: {
        tags: ['Coins'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
            },
            required: ['status'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: { type: 'string', enum: ['canNotRemove'] },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const isSuccess = await fastify.controls.coins.baseCurrencySetting.remove(
        userId
      );
      if (!isSuccess) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'canNotRemove',
        };
        reply.code(240).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
      };
      reply.send(responce);
    }
  );

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
              data: { $ref: 'BaseCurrencySetting' },
            },
            required: ['status'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: {
                type: 'string',
                enum: ['baseCurrencySettingHasNotFound'],
              },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const result = await getBaseCurrencyCurrentUserModel(userId);

      const responce: ResponceType = {
        status: 'ok',
        data: result.toJSON(),
      };
      reply.send(responce);
    }
  );
};
