import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import Redis from 'ioredis';
import { redisConfig } from '../config/redis.config';

@Injectable()
export class RedisService {
  private readonly client = new Redis(redisConfig.url);
  private hits = 0;
  private reads = 0;

  getProfile(keyPart: string): Promise<string | null> {
    return this.get(`profile:${keyPart}`);
  }

  setProfile(keyPart: string, value: string): Promise<'OK'> {
    return this.set(`profile:${keyPart}`, value, 60);
  }

  async get(key: string): Promise<string | null> {
    return Sentry.startSpan({ name: 'redis.get', op: 'cache.get' }, async () => {
      Sentry.setTag('cache.key_prefix', this.prefix(key));
      const value = await this.client.get(key);
      this.reads += 1;
      if (value !== null) {
        this.hits += 1;
      }
      Sentry.setMeasurement('cache.hit_rate', this.hits / this.reads, 'ratio');
      return value;
    });
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    return Sentry.startSpan({ name: 'redis.set', op: 'cache.set' }, async () => {
      Sentry.setTag('cache.key_prefix', this.prefix(key));
      return ttlSeconds ? this.client.set(key, value, 'EX', ttlSeconds) : this.client.set(key, value);
    });
  }

  async del(key: string): Promise<number> {
    return Sentry.startSpan({ name: 'redis.del', op: 'cache.del' }, async () => {
      Sentry.setTag('cache.key_prefix', this.prefix(key));
      return this.client.del(key);
    });
  }

  private prefix(key: string): string {
    return key.split(':')[0] || 'unknown';
  }
}
