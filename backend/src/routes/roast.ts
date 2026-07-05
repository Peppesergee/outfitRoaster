import { FastifyInstance } from 'fastify';
import { analyzeOutfit } from '../services/gemini';

const FREE_DAILY_LIMIT = 3;
const dailyUsage = new Map<string, { count: number; date: string }>();

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function checkRateLimit(deviceId: string): boolean {
  const today = getToday();
  const entry = dailyUsage.get(deviceId);
  if (!entry || entry.date !== today) {
    dailyUsage.set(deviceId, { count: 0, date: today });
    return true;
  }
  return entry.count < FREE_DAILY_LIMIT;
}

function incrementUsage(deviceId: string): void {
  const today = getToday();
  const entry = dailyUsage.get(deviceId);
  if (!entry || entry.date !== today) {
    dailyUsage.set(deviceId, { count: 1, date: today });
  } else {
    entry.count++;
  }
}

interface RoastBody {
  image: string;
  tone?: string;
  intensity?: number;
  deviceId?: string;
}

export async function roastRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RoastBody }>('/api/roast', {
    schema: {
      body: {
        type: 'object',
        required: ['image'],
        properties: {
          image: { type: 'string', minLength: 100 },
          tone: { type: 'string', enum: ['brutal', 'ironic', 'constructive'], default: 'ironic' },
          intensity: { type: 'number', minimum: 1, maximum: 10, default: 5 },
          deviceId: { type: 'string', default: 'anonymous' },
        },
      },
    },
  }, async (request, reply) => {
    const { image, tone = 'ironic', intensity = 5, deviceId = 'anonymous' } = request.body;

    if (!checkRateLimit(deviceId)) {
      return reply.status(429).send({
        success: false,
        error: 'Daily roast limit reached. Upgrade to Pro for unlimited roasts!',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return reply.status(503).send({ success: false, error: 'Service not configured.' });
    }

    try {
      const data = await analyzeOutfit(image, tone, intensity);
      incrementUsage(deviceId);
      return reply.send({ success: true, data });
    } catch (err: any) {
      fastify.log.error(err);
      return reply.status(500).send({
        success: false,
        error: 'Could not generate roast. Try again!',
      });
    }
  });

  fastify.get('/health', async () => ({ status: 'ok' }));
}
