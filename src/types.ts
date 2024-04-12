import { FastifyInstance } from 'fastify';
import { socketioServer } from 'fastify-socket.io';

export type FastifyType = FastifyInstance & {
  controls: {
    // targetController: TargetController;
    // orderController: OrderController;
  };
  io: typeof socketioServer;
};

export type ErrorType = {
  status: 'error';
  field?: string;
  message: string;
};

export type ResponceType = {
  [key: string]: any;
  status: 'ok' | 'error';
};

export type DataResponceType<T> = {
  data?: T;
};

export interface IDBDefaultData {
  id: string;
  createdAt: string;
  updatedAt: string;
}
