import dotenv from 'dotenv';
import { injectable } from 'inversify';

import { validate } from '../validation/validate';
import { ConfigDto } from './config.dto';
import config from './config.map';

@injectable()
export class ConfigService {
  private readonly config: ConfigDto;

  constructor() {
    const path = process.env.NODE_ENV === 'prod' ? '.env.production' : '.env';

    dotenv.config({ path });

    const result = config();

    this.config = validate(ConfigDto, result);
  }

  get env(): ConfigDto {
    return this.config;
  }

  get redisConnectionString(): string {
    const { username, password, host, port, database } = this.config.redis;

    return `redis://${username}:${password}@${host}:${port}/${database}`;
  }
}
