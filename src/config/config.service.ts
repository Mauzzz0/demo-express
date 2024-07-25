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

  get env() {
    return this.config;
  }
}
