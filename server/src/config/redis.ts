import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client using ioredis
const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  logger.info('✅ Connected to Redis');
});

redis.on('ready', () => {
  logger.info('✅ Redis client ready');
});

redis.on('close', () => {
  logger.warn('Redis connection closed');
});

/**
 * Connect to Redis
 */
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
  } catch (error) {
    // If already connected, ignore the error
    if ((error as Error).message?.includes('already')) {
      return;
    }
    throw error;
  }
};

/**
 * Disconnect from Redis
 */
export const disconnectRedis = async (): Promise<void> => {
  await redis.quit();
};

export { redis };
