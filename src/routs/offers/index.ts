import { ErrorType, FastifyType, ResponceType } from '../../types';
import isAfter from 'date-fns/isAfter';

interface ICreateOfferBody {
  email: string;
}

interface IConfirmOfferBody {
  email: string;
  code: number;
}

export const offerRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{ Body: ICreateOfferBody }>(
    '/create',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            email: { type: 'string' },
          },
          required: ['email'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
            },
            required: ['status'],
          },
          400: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'field', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const {
        body: { email },
      } = request;
      const user = await fastify.controls.users.getUserByEmail(email);
      const offer = await fastify.controls.offers.get(email);
      switch (true) {
        case !!user: {
          const error: ErrorType = {
            status: 'error',
            field: 'email',
            message: 'Email is busy',
          };
          reply.code(400).send(error);
          break;
        }
        default: {
          if (!!offer) {
            await fastify.controls.offers.remove(email);
          }
          const code = await fastify.controls.offers.create(email, '999999');

          // TODO: настроить клиент для рассылки
          // fastify.mailer.SendMail(email, {
          //     subject: `Заявка на регестрацию`,
          //     text: `Код подтвеждения регистрации`,
          //     html: `<h1>Код подтвеждения регистрации</h1>
          //         <span>Код: ${code}</span>
          //     `,
          // })
          const responce: ResponceType = {
            status: 'ok',
          };
          reply.send(responce);
        }
      }
    }
  );

  fastify.put<{ Body: IConfirmOfferBody }>(
    '/confirm',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            code: { type: 'number' },
            email: { type: 'string' },
          },
          required: ['code', 'email'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
            },
            required: ['status'],
          },
          400: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'field', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const { code, email } = request.body;
      const offer = await fastify.controls.offers.get(email);
      switch (true) {
        case !offer: {
          const error: ResponceType & ErrorType = {
            status: 'error',
            field: 'email',
            message: 'not has offer by email',
          };
          reply.code(400).send(error);
          break;
        }
        case offer?.code !== code: {
          const error: ResponceType & ErrorType = {
            status: 'error',
            field: 'code',
            message: 'code is not valid',
          };
          reply.code(400).send(error);
          break;
        }
        case !!offer && !isAfter(new Date(offer.lifeDate), new Date()): {
          const error: ResponceType & ErrorType = {
            status: 'error',
            field: 'code',
            message: 'invitation expired',
          };
          reply.code(400).send(error);
          break;
        }
        case !!offer?.isConfirm: {
          const error: ResponceType & ErrorType = {
            status: 'error',
            field: 'code',
            message: 'code has confirm',
          };
          reply.code(400).send(error);
          break;
        }
        default: {
          await fastify.controls.offers.confirm((offer as any).id);
          const responce: ResponceType = {
            status: 'ok',
          };
          reply.send(responce);
        }
      }
    }
  );
};
