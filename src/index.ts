import Fastify from 'fastify';
import middie from 'middie';
import { routs } from './routs';
import path from 'path';
import multer from 'fastify-multer';
import { readFileSync } from 'fs';
import cors from '@fastify/cors';
import ioSocket from 'fastify-socket.io';
import {
  FilesController,
  FoodsController,
  OffersController,
  OrdersController,
  ReviewsController,
  UserProgramController,
  UsersController,
} from './controllers';
import { swaggerPlugin } from './routs/swagger';
import { TasksController } from './controllers/TasksController';
import { TracksControler } from './controllers/TracksControler';
import { FastifyType } from './types';
import { MealEntriesController } from './controllers/MealsController';
import { DishesController } from './controllers/DishesController';

export const upload = multer({ dest: 'uploads/' });

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

require('dotenv').config();

export class Server {
  private port;

  fastify: ReturnType<typeof Fastify>;

  constructor(port: number) {
    this.port = port;
    this.fastify = Fastify({
      logger: envToLogger.development ?? true,
      https: {
        key: readFileSync(path.join(__dirname, '..', 'https', 'vmariev.key')),
        cert: readFileSync(path.join(__dirname, '..', 'https', 'vmariev.cert')),
      },
    });
    this.fastify.register(require('fastify-mailer'), {
      defaults: { from: `vmariev <${process.env.MAILER_LOGIN}>` },
      transport: {
        host: process.env.MAILER_HOST,
        port: 465,
        secure: true, // use TLS
        auth: {
          user: process.env.MAILER_LOGIN,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    });
    this.fastify.decorate('controls', {
      orders: new OrdersController(),
      users: new UsersController(),
      offers: new OffersController(),
      reviews: new ReviewsController(),
      files: new FilesController(),
      tasks: new TasksController(),
      tracks: new TracksControler(),
      glutton: {
        food: new FoodsController(),
        userProgram: new UserProgramController(),
        mealsEntries: new MealEntriesController(),
        dishes: new DishesController(),
      },
    } as FastifyType['controls']);
    this.fastify.register(swaggerPlugin);
    this.fastify.register(middie);
    this.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, '..', 'dist', 'storybook'),
      prefix: '/storybook',
      decorateReply: false,
    });
    this.fastify.register(require('@fastify/static'), {
      root: path.join(__dirname, '..', 'dist', 'spa'),
      wildcard: false,
    });
    this.fastify.setNotFoundHandler((req, res: any) => {
      res.sendFile('index.html');
    });
    this.fastify.register(ioSocket, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    this.fastify.register(cors, {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    });
    this.fastify.ready((error) => {
      this.fastify.io.on('connection', (socket) =>
        console.info('Socket connected!', socket.id)
      );
    });
  }
  run() {
    this.fastify.listen(
      { port: this.port, host: process.env.HOST },
      function (err, address) {
        console.log('address', address);
        if (err) {
          console.log('err', err);
          process.exit(1);
        }
      }
    );
  }
}

export const server = new Server(Number(process.env.PORT));
server.run();
