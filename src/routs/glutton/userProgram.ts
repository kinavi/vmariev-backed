import { FastifyType, ResponceType, ResponseErrorType } from '../../types';
import { NO_ACCESS_CODE_ERROR } from '../../constants';
import { FoodAttributes } from '../../database/models/food';

export const userProgramsRoutes: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
  fastify.post<{
    Body: {
      sex: string;
      age: number;
      physicalActivity: number;
      goal: number;
    };
  }>(
    '/',
    {
      schema: {
        tags: ['Glutton'],
        body: {
          type: 'object',
          properties: {
            sex: { type: 'string' },
            age: { type: 'number' },
            physicalActivity: { type: 'number' },
            goal: { type: 'number' },
          },
          required: ['sex', 'age', 'physicalActivity', 'goal'],
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
        body: { age, goal, physicalActivity, sex },
      } = request;
      const userId = request.user?.id;
      if (!userId) {
        throw new Error(NO_ACCESS_CODE_ERROR);
      }
      const hasProgram = await fastify.controls.glutton.userProgram.hasProgram(
        userId
      );
      if (hasProgram) {
        const responce: ResponseErrorType = {
          status: 'error',
          message: 'user has already program',
        };
        reply.code(240).send(responce);
        return;
      }
      const program = await fastify.controls.glutton.userProgram.create({
        age,
        goal,
        physicalActivity,
        sex,
        userId,
      });
      console.log('program', program)
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
};
