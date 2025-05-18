import { ResponseErrorType, FastifyType, ResponceType } from '../../types';
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
              status: { type: 'string', enum: ['ok'] },
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
                enum: ['timeResendingHasNotExpired', 'errorCreatingRequest'],
              },
            },
            required: ['status', 'message'],
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
      const timeForRecreatingOffer =
        (Number(process.env.TIME_FOR_RECREATING_OFFER_SECOMDS) || 0) * 1000;
      const createTime = offer?.createdAt?.getTime() || 0;
      const currentTime = new Date().getTime();
      const isTimeResendingHasNotExpired =
        !!offer && createTime + timeForRecreatingOffer - currentTime >= 0;
      switch (true) {
        case isTimeResendingHasNotExpired: {
          const error: ResponseErrorType = {
            status: 'error',
            field: 'email',
            message: 'timeResendingHasNotExpired',
          };
          reply.code(400).send(error);
          break;
        }
        case !!user: {
          const error: ResponseErrorType = {
            status: 'error',
            field: 'email',
            message: 'errorCreatingRequest',
          };
          reply.code(240).send(error);
          break;
        }
        default: {
          if (!!offer) {
            await fastify.controls.offers.remove(email);
          }
          const code = await fastify.controls.offers.create(email, '999999');
          if (process.env.NODE_ENV === 'production') {
            fastify.mailer.sendMail(
              {
                to: email,
                text: `Код подтвеждения регистрации: ` + code,
              },
              (errors, info) => {
                if (errors) {
                  fastify.log.error(errors);
                } else {
                  fastify.log.info('send confirm code to: ' + info.to);
                }
              }
            );
          }
          const responce: ResponceType = {
            status: 'ok',
          };
          reply.send(responce);
        }
      }
    }
  );
};
