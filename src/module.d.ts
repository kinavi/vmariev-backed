import { RequestGenericInterface, FastifyInstance } from 'fastify'
import { IUser } from './models/UsersModel'
declare module 'fastify' {
    interface FastifyRequest extends RequestGenericInterface {
      file: any
      user: IUser | null 
    }
  }