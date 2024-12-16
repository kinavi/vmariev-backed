import { FastifyType, ResponceType, ResponseErrorType } from '../../types';
import { NO_ACCESS_CODE_ERROR } from '../../constants';
import {
  ActivityType,
  GoalType,
  SexType,
} from '../../database/models/userProgram';

export const userProgramsRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{
    Body: {
      sex: SexType;
      age: number;
      weight: number;
      height: number;
      physicalActivity: ActivityType;
      goal: GoalType;
      ratioCarbohydrates: number;
      ratioProteins: number;
      ratioFats: number;
      isExcludeActivity: boolean;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        body: {
          type: 'object',
          properties: {
            sex: { type: 'string', enum: [SexType.MALE, SexType.FEMALE] },
            age: { type: 'number' },
            weight: { type: 'number' },
            height: { type: 'number' },
            physicalActivity: {
              type: 'string',
              enum: [
                ActivityType.LOW,
                ActivityType.LIGHT,
                ActivityType.MIDDLE,
                ActivityType.HIGH,
                ActivityType.EXTREME,
              ],
            },
            goal: {
              type: 'string',
              enum: [GoalType.MASS_GAIN, GoalType.NORMAL, GoalType.WEIGHT_LOSS],
            },
            ratioCarbohydrates: { type: 'number' },
            ratioProteins: { type: 'number' },
            ratioFats: { type: 'number' },
            isExcludeActivity: { type: 'boolean' },
          },
          required: [
            'sex',
            'age',
            'physicalActivity',
            'goal',
            'ratioCarbohydrates',
            'ratioProteins',
            'ratioFats',
            'weight',
            'height',
            'isExcludeActivity',
          ],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'UserProgram',
              },
            },
            required: ['status', 'data'],
          },
          240: {
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
      const {
        body: {
          age,
          goal,
          physicalActivity,
          sex,
          height,
          weight,
          ratioCarbohydrates,
          ratioFats,
          ratioProteins,
          isExcludeActivity,
        },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const hasProgram = await fastify.controls.glutton.userProgram.hasProgram(
        userId
      );
      if (hasProgram) {
        // Вот тут будем проверять наличие записей по программе
        // Если их нет, удаляем старую программу
        // const responce: ResponseErrorType = {
        //   status: 'error',
        //   message: 'user has already program',
        // };
        // reply.code(240).send(responce);
        // return;
      }
      const program = await fastify.controls.glutton.userProgram.create({
        age,
        goal,
        physicalActivity,
        sex: SexType[sex],
        userId,
        height,
        weight,
        ratioCarbohydrates,
        ratioFats,
        ratioProteins,
        isExcludeActivity,
      });

      if (!program) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'program can not created',
        };
        reply.code(240).send(responce);
        return;
      }

      const responce: ResponceType = {
        status: 'ok',
        data: program,
      };
      reply.send(responce);
    }
  );

  fastify.get<{ Params: { userId: string } }>(
    '/user/:userId',
    {
      schema: {
        tags: ['Glutton'],
        params: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
          },
          required: ['userId'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok'] },
              data: {
                $ref: 'UserProgram',
              },
            },
            required: ['status', 'data'],
          },
          240: {
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
      const { userId } = request.params; // Здесь получаем id из пути
      const _userId = Number(userId);
      if (!_userId) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'userId has not set or not number',
        };
        reply.code(240).send(responce);
        return;
      }
      const result = await fastify.controls.glutton.userProgram.getByUserId(
        _userId
      );
      if (!result) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'program can not find',
        };
        reply.code(240).send(responce);
        return;
      }
      const responce: ResponceType = {
        status: 'ok',
        data: result,
      };
      reply.send(responce);
    }
  );
};
