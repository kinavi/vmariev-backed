// plugins/currencyJob.ts
import cron from 'node-cron';
import { FastifyInstance } from 'fastify';
import { fetchAndSaveRates } from '../utils/fetchAndSaveRates';
import recalculateBalance from '../utils/recalculateBalance';

export default async function currencyJob(fastify: FastifyInstance) {
  fastify.log.info('jobs is ready');
  cron.schedule('0 3 * * *', async () => {
    // Каждый день в 3:00 ночи по серверному времени
    await fetchAndSaveRates(fastify);
    return recalculateBalance(fastify);
  });
}
