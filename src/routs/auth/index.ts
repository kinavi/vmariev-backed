import { UNAUTHORIZED_CODE_ERROR } from '../../constants';
import {
  ResponseErrorType,
  FastifyType,
  ResponceType,
  UserRole,
} from '../../types';
import sha256 from 'crypto-js/sha256';
import cookie from '@fastify/cookie';

require('dotenv').config();

interface ICreateUserBody {
  password: string;
  code: number;
  email: string;
}

function encodeObject(obj: any) {
  return sha256(JSON.stringify(obj));
}

const COOKI_NAME = 'vm_device_id';

async function decodeObject(token: string) {}

const encodeDeviceId = (data: { ip: string; userAgent: string | null }) => {
  return encodeObject(data).toString();
};

const createDeviceIdCookie = (deviceId: string) => {
  return cookie.serialize(COOKI_NAME, deviceId, {
    maxAge: Number(process.env.MAX_AGE_COOKIE_SECONDS),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV !== 'development' ? true : false,
  });
};

export const authRoutes: any = async (fastify: FastifyType, options: any) => {
  fastify.post<{ Body: ICreateUserBody }>(
    '/signUp',
    {
      schema: {
        body: {
          type: 'object',
          required: ['password', 'code', 'email'],
          properties: {
            password: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            code: {
              type: 'number',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'object',
                properties: {
                  access_token: { type: 'string' },
                  refresh_token: { type: 'string' },
                  user: {
                    $ref: 'User',
                  },
                },
                required: ['access_token', 'refresh_token', 'user'],
              },
            },
            required: ['status', 'data'],
          },
          250: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password, code } = request.body;
        const user = await fastify.controls.users.getUserByEmail(email);
        const offer = await fastify.controls.offers.get(email);
        if (!offer || offer.code !== code) {
          const error: ResponceType & ResponseErrorType = {
            status: 'error',
            field: 'code',
            message: 'not has offer or offer not confirm',
          };
          reply.code(250).send(error);
          return;
        }
        if (user) {
          const error: ResponceType & ResponseErrorType = {
            status: 'error',
            field: 'email',
            message: 'email is busy',
          };
          reply.code(250).send(error);
          return;
        }
        await fastify.controls.users.create({
          email,
          login: '',
          password,
          phone: '',
          role: UserRole.client,
        });
        if (offer.id) {
          await fastify.controls.offers.confirm(offer.id);
        }
        const userAgent = request.headers['user-agent'] || 'no-agent';
        const deviceId = await encodeDeviceId({
          ip: request.ip,
          userAgent,
        });

        const result = await fastify.controls.users.createToken(
          email,
          password,
          deviceId
        );

        const responce: ResponceType = {
          status: 'ok',
          data: result,
        };

        const _cookie = createDeviceIdCookie(deviceId);
        reply.header('set-cookie', _cookie);
        reply.send(responce);
      } catch (error: any) {
        if ('status' in error) {
          reply.code(250).send(error);
        } else {
          reply.code(500).send(error);
        }
      }
    }
  );
  fastify.post<{ Body: ICreateUserBody }>(
    '/signIn',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['password', 'email'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                type: 'object',
                properties: {
                  access_token: { type: 'string' },
                  refresh_token: { type: 'string' },
                  user: {
                    $ref: 'User',
                  },
                },
                required: ['access_token', 'refresh_token', 'user'],
              },
            },
            required: ['status', 'data'],
          },
          400: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const userAgent = request.headers['user-agent'] || null;
        const deviceId = await encodeDeviceId({
          ip: request.ip,
          userAgent,
        });
        fastify.log.info(COOKI_NAME, deviceId);
        const result = await fastify.controls.users.createToken(
          email,
          password,
          deviceId
        );
        const responce = {
          status: 'ok',
          data: result,
        };
        const _cookie = createDeviceIdCookie(deviceId);
        reply.header('set-cookie', _cookie);
        reply.send(responce);
      } catch (error: any) {
        if ('status' in error) {
          reply.code(400).send(error);
        } else {
          reply.code(500).send(error);
        }
      }
    }
  );

  fastify.post<{ Body: { refresh_token: string; email: string } }>(
    '/refreshToken',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            refresh_token: { type: 'string' },
            email: { type: 'string' },
          },
          required: ['refresh_token', 'email'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              data: {
                type: 'object',
                properties: {
                  access_token: { type: 'string' },
                  refresh_token: { type: 'string' },
                  user: {
                    $ref: 'User',
                  },
                },
                required: ['access_token', 'refresh_token', 'user'],
              },
            },
            required: ['status', 'data'],
          },
          400: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              field: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['status', 'message'],
          },
        },
      },
    },
    async (request, reply) => {
      const { email, refresh_token } = request.body;

      const deviceIdFromCookies = request.cookies[COOKI_NAME];

      if (!deviceIdFromCookies) {
        throw new Error(UNAUTHORIZED_CODE_ERROR);
      }

      const isValid = await fastify.controls.users.checkRefreshToken(
        refresh_token,
        deviceIdFromCookies
      );

      if (!isValid) {
        throw new Error(UNAUTHORIZED_CODE_ERROR);
      }

      const data = await fastify.controls.users.getRefreshTokenPayload(
        refresh_token
      );

      if (!data) {
        throw new Error(UNAUTHORIZED_CODE_ERROR);
      }

      const userAgent = request.headers['user-agent'] || 'no-agent';

      const updatedDeviceId = await encodeDeviceId({
        ip: request.ip,
        userAgent,
      });

      const result = await fastify.controls.users.refreshTokens(
        email,
        updatedDeviceId
      );

      const responce = {
        status: 'ok',
        data: result,
      };

      const updatedCookie = createDeviceIdCookie(updatedDeviceId);
      reply.header('set-cookie', updatedCookie);
      reply.send(responce);
    }
  );
};
