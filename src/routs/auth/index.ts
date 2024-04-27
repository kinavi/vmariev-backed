import { NO_ACCESS_CODE_ERROR } from '../../constants';
import {
  ResponseErrorType,
  FastifyType,
  ResponceType,
  UserRole,
} from '../../types';

interface ICreateUserBody {
  password: string;
  phone: string;
  email: string;
  login: string;
  role: UserRole;
}

export const authRoutes: any = async (fastify: FastifyType, options: any) => {
  fastify.post<{ Body: ICreateUserBody }>(
    '/signUp',
    {
      schema: {
        body: {
          type: 'object',
          required: ['password', 'phone', 'email', 'login', 'role'],
          properties: {
            password: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            login: {
              type: 'string',
            },
            role: {
              type: 'string',
            },
          },
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
              },
            },
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
      const { email, login, password, phone, role } = request.body;
      const user = await fastify.controls.users.getUserByEmail(email);
      const offer = await fastify.controls.offers.get(email);
      switch (true) {
        case !offer || !offer.isConfirm: {
          const error: ResponceType & ResponseErrorType = {
            status: 'error',
            field: 'email',
            message: 'not has offer or offer not confirm',
          };
          reply.code(400).send(error);
          break;
        }
        case !!user: {
          const error: ResponceType & ResponseErrorType = {
            status: 'error',
            field: 'email',
            message: 'email is busy',
          };
          reply.code(400).send(error);
          break;
        }
        default: {
          const user = await fastify.controls.users.create({
            email,
            login,
            password,
            phone,
            role: UserRole.client,
          });
          const result = await fastify.controls.users.createToken(
            email,
            password
          );
          const responce: ResponceType = {
            status: 'ok',
            data: result,
          };
          reply.send(responce);
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
              },
            },
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
      try {
        const { email, password } = request.body;
        const result = await fastify.controls.users.createToken(
          email,
          password
        );
        const responce = {
          status: 'ok',
          data: result,
        };
        reply.send(responce);
      } catch (error) {
        if ((error as any).status === 'error') {
          reply.code(403).send(error);
        }
        throw error;
      }
    }
  );

  fastify.post<{ Body: { refresh_token: string; client_id: string } }>(
    '/refreshToken',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            refresh_token: { type: 'string' },
            client_id: { type: 'string' },
          },
          required: ['refresh_token', 'device_id'],
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
              },
            },
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
      try {
        const { client_id, refresh_token } = request.body;

        const isValid = await fastify.controls.users.checkRefreshToken(
          refresh_token,
          client_id
        );
        if (!isValid) {
          throw new Error(NO_ACCESS_CODE_ERROR);
        }

        const data = await fastify.controls.users.getRefreshTokenPayload(
          refresh_token
        );

        if (!data) {
          throw new Error(NO_ACCESS_CODE_ERROR);
        }

        const result = await fastify.controls.users.createToken(
          request.user.email,
          data.password
        );
        const responce = {
          status: 'ok',
          data: result,
        };
        reply.send(responce);
      } catch (error) {
        if ((error as any).status === 'error') {
          reply.send(error);
        }
        throw error;
      }
    }
  );
};
