import { FastifyInstance } from 'fastify';
import { socketioServer } from 'fastify-socket.io';
import {
  FilesController,
  OffersController,
  OrdersController,
  ReviewsController,
  UsersController,
} from './controllers';

export type FastifyType = FastifyInstance & {
  controls: {
    users: UsersController;
    offers: OffersController;
    reviews: ReviewsController;
    files: FilesController;
    orders: OrdersController;
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

export enum UserRole {
  executor = 'executor',
  client = 'client',
  owner = 'owner',
}
