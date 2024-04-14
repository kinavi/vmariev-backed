import { server } from './';
import { FastifyType } from './types';

export function build(): FastifyType {
  beforeAll(async () => {
    await server.fastify.ready();
  });

  afterAll(() => server.fastify.close());

  return server.fastify as any;
}
