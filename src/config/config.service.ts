import dotenv from 'dotenv';
import { injectable } from 'inversify';

import { validate } from '../validation/validate';
import { ConfigDto } from './config.dto';

@injectable()
export class ConfigService {
  private readonly config: ConfigDto;

  constructor() {
    const path = process.env.NODE_ENV === 'prod' ? '.env.production' : '.env';

    const result = dotenv.config({ path });

    if (result.error) {
      throw result.error;
    }

    this.config = validate(ConfigDto, result.parsed);
  }

  get env(): ConfigDto {
    return this.config;
  }

  get redisConnectionString(): string {
    const user = this.config.REDIS_USERNAME;
    const password = this.config.REDIS_PASSWORD;
    const host = this.config.REDIS_HOST;
    const port = this.config.REDIS_PORT;
    const db = this.config.REDIS_DATABASE;

    return `redis://${user}:${password}@${host}:${port}/${db}`;
  }
}
