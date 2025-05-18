import { RequestGenericInterface, FastifyInstance } from 'fastify';
import { IUser } from './models/UsersModel';
import { FastifyType } from './types';
declare module 'fastify' {
  interface FastifyRequest extends RequestGenericInterface {
    file: any;
    user: IUser | null;
  }
}
