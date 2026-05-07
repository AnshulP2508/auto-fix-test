import * as dotenv from 'dotenv';
dotenv.config();

export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379'
};
