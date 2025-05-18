import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { TransactionCategory } from '../../database/models';
import { FastifyType, ResponceType, ResponseErrorType } from '../../types';

export const transactionCategoryRoutes: any = async (
  fastify: FastifyType,
  options: any
) => {
  fastify.post<{
    Body: {
      title: string;
      color: string;
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
            color: { type: 'string' },
          },
          required: ['title', 'color'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'TransactionCategory',
              },
            },
            required: ['status', 'data'],
          },
        },
      },
    },
    async (request, reply) => {
      const { color, title } = request.body;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      // Стоит установить лимит на создание категорий

      const resultModel = await TransactionCategory.create({
        color,
        title,
        userId,
      });

      const resultData = resultModel.toJSON();

      const responce: ResponceType = {
        status: 'ok',
        data: resultData,
      };
      reply.send(responce);
    }
  );

  fastify.put<{
    Body: {
      title: string;
      color: string;
    };
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Coins'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            color: { type: 'string' },
          },
          required: ['title', 'color'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'TransactionCategory',
              },
            },
            required: ['status', 'data'],
          },
          240: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: { type: 'string', enum: ['notExist'] },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const {
        body: { color, title },
        params: { id },
      } = request;

      const userId = request.user?.id;

      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const currentTransactionCategoryModel = await TransactionCategory.findOne(
        {
          where: {
            id,
          },
        }
      );

      if (!currentTransactionCategoryModel) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'notExist',
        };
        reply.code(240).send(responce);
        return;
      }

      currentTransactionCategoryModel.color = color;
      currentTransactionCategoryModel.title = title;
      const updatedModel = await currentTransactionCategoryModel.save();
      const updatedData = updatedModel.toJSON();

      const responce: ResponceType = {
        status: 'ok',
        data: updatedData,
      };
      reply.send(responce);
    }
  );

  fastify.delete<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Coins'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
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
      const {
        params: { id },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const data = await TransactionCategory.destroy({
        where: {
          id,
        },
      });
      const isSuccess = data > 0;

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

  fastify.get<{
    Params: { id: string };
  }>(
    '/:id',
    {
      schema: {
        tags: ['Coins'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'TransactionCategory',
              },
            },
            required: ['status', 'data'],
          },
        },
      },
    },
    async (request, reply) => {
      const {
        params: { id },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const dataModel = await TransactionCategory.findOne({
        where: {
          id,
        },
      });
      const data = dataModel?.toJSON();

      if (!data) {
        reply.code(404);
        return;
      }

      const responce: ResponceType = {
        status: 'ok',
        data,
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
              data: {
                type: 'array',
                items: { $ref: 'TransactionCategory' },
              },
            },
            required: ['status', 'data'],
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }

      const dataModel = await TransactionCategory.findAll({
        where: {
          userId,
        },
      });
      const data = dataModel.map((item) => item.toJSON());

      const responce: ResponceType = {
        status: 'ok',
        data,
      };
      reply.send(responce);
    }
  );
};
