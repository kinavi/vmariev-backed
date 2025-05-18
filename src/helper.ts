import { serverInstans } from './server';
import { FastifyType } from './types';

export function build(): FastifyType {
  beforeAll(async () => {
    await serverInstans.fastify.ready();
  });

  afterAll(() => serverInstans.fastify.close());

  return serverInstans.fastify as any;
}
