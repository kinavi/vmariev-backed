import { NO_ACCESS_CODE_ERROR } from '../../../constants';
import { UserBalance, UserPlannedBalance } from '../../../database/models';
import { FastifyType, ResponceType } from '../../../types';
import { tokenVerification } from '../../../verification/tokenVerification';

export const getCurrentBalancesRoute: any = async (
  fastify: FastifyType,
  options: any,
  done: any
) => {
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
                type: 'object',
                properties: {
                  current: {
                    allOf: [
                      { $ref: 'UserBalance' },
                      { type: 'object', nullable: true },
                    ],
                  },
                  planned: {
                    allOf: [
                      { $ref: 'UserPlannedBalance' },
                      { type: 'object', nullable: true },
                    ],
                  },
                },
                required: ['current', 'planned'],
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

      const currentUserBalance = await UserBalance.findOne({
        where: {
          userId,
        },
      });

      const plannedUserBalance = await UserPlannedBalance.findOne({
        where: {
          userId,
        },
      });

      const responce: ResponceType = {
        status: 'ok',
        data: {
          current: currentUserBalance?.toJSON() || null,
          planned: plannedUserBalance?.toJSON() || null,
        },
      };
      reply.send(responce);
    }
  );
};
