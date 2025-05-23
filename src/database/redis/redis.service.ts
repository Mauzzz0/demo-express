import { SetOptions } from '@redis/client';
import { inject, injectable } from 'inversify';
import { createClient } from 'redis';
import { ConfigService } from '../../config/config.service';
import logger from '../../logger/pino.logger';

@injectable()
export class RedisService {
  private redis: ReturnType<typeof createClient>;

  constructor(
    @inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  async connect() {
    if (this.redis) return;

    const client = createClient({ url: this.config.redisConnectionString });
    try {
      await client.connect();
    } catch (error) {
      logger.error("Can't connect to redis:");
      throw error;
    }

    this.redis = client;
  }

  async set(key: string, value: Record<string, any>, options?: SetOptions) {
    const json = JSON.stringify(value);

    return this.redis.set(key, json, options);
  }

  async get<T extends Record<string, any>>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value);
  }

  async delete(key: string) {
    return await this.redis.del(key);
  }
}
