import { SetOptions } from '@redis/client';
import { injectable } from 'inversify';
import { createClient } from 'redis';
import { appConfig } from '../config';

@injectable()
export class RedisService {
  private readonly redis = createClient({
    url: `redis://${appConfig.redis.username}:${appConfig.redis.password}@${appConfig.redis.host}:${appConfig.redis.port}/${appConfig.redis.database}`,
  });

  constructor() {
    this.connect();
  }

  async connect() {
    await this.redis.connect();
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
