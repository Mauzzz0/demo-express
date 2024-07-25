import { inject, injectable } from 'inversify';
import { createClient } from 'redis';

import { ConfigService } from '../../config/config.service';
import { Components } from '../../shared/inversify.types';

@injectable()
export class RedisService {
  private redis: ReturnType<typeof createClient>;

  constructor(
    @inject(Components.ConfigService)
    private readonly config: ConfigService,
  ) {}

  async connect() {
    if (this.redis) return;

    const client = createClient({ url: this.config.redisConnectionString });
    try {
      await client.connect();
    } catch (error) {
      console.log("Can't connect to redis:");
      throw error;
    }

    this.redis = client;
  }
}
