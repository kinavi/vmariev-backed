import Fastify from 'fastify';
import middie from 'middie';
import { routs } from './routs';
import path from 'path';
import { readFileSync } from 'fs';

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
  private fastify: ReturnType<typeof Fastify>;

  private port;

  constructor(port: number) {
    this.port = port;
    this.fastify = Fastify({
      logger: envToLogger.development ?? true,
      https: {
        key: readFileSync(path.join(__dirname, '..', 'https', 'fastify.key')),
        cert: readFileSync(path.join(__dirname, '..', 'https', 'fastify.cert')),
      },
    });
    this.fastify.register(middie);
    this.fastify.register(routs, { prefix: '/api', logLevel: 'debug' });
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
  }
  run() {
    this.fastify.listen(
      { port: 443, host: '0.0.0.0' },
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

new Server(process.env.PORT ? Number(process.env.PORT) : 5000).run();
