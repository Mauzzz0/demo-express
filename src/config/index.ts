import dotenv from 'dotenv';

import { validate } from '../validation/validate';
import { ConfigDto } from './config.dto';

const path = process.env.NODE_ENV === 'prod' ? '.env.production' : '.env';

const result = dotenv.config({ path });

if (result.error) {
  throw result.error;
}

const config = validate(ConfigDto, result.parsed);

export default config;
