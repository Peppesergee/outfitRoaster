import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { roastRoutes } from './routes/roast';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

const fastify = Fastify({
  logger: { level: process.env.NODE_ENV === 'production' ? 'warn' : 'info' },
  bodyLimit: 10 * 1024 * 1024, // 10MB for base64 images
});

async function bootstrap() {
  await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST'],
  });

  await fastify.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      success: false,
      error: 'Too many requests. Slow down!',
    }),
  });

  await fastify.register(roastRoutes);

  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🔥 Outfit Roaster backend running on port ${PORT}`);
}

bootstrap().catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
