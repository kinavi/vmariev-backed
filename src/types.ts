import { FastifyInstance } from 'fastify';
import { socketioServer } from 'fastify-socket.io';
import {
  FilesController,
  OffersController,
  OrdersController,
  ReviewsController,
  UsersController,
  FoodsController,
  UserProgramController,
} from './controllers';
import { TasksController } from './controllers/TasksController';
import { TracksControler } from './controllers/TracksControler';
import { MealEntriesController } from './controllers/MealsController';
import { DishesController } from './controllers/DishesController';
import { UserActivityEntriesController } from './controllers/UserActivityEntriesController';
import { BaseCurrencyUserController } from './controllers/BaseCurrencyUserController';

type PluginsType = {
  controls: {
    users: UsersController;
    offers: OffersController;
    reviews: ReviewsController;
    files: FilesController;
    orders: OrdersController;
    tasks: TasksController;
    tracks: TracksControler;
    glutton: {
      food: FoodsController;
      userProgram: UserProgramController;
      mealsEntries: MealEntriesController;
      dishes: DishesController;
      userActivityEntries: UserActivityEntriesController;
    };
    coins: {
      baseCurrencySetting: BaseCurrencyUserController;
    };
  };
  io: typeof socketioServer;
  mailer: {
    sendMail: (
      options: { to: string; text: string },
      callback: (error: any, info: { from: string; to: string }) => void
    ) => void;
  };
  cookies: {
    [key: string]: any;
  };
};

export type FastifyType = FastifyInstance & PluginsType;

export type ResponseErrorType = {
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
