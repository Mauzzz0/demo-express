import dotenv from 'dotenv';
import { ConfigDto } from './config.dto';
import { validate } from '../validation/validate';

const path = process.env.NODE_ENV === 'prod' ? '.env.production' : '.env';

const result = dotenv.config({ path });

if (result.error) {
  throw result.error;
}

const config = validate(ConfigDto, result.parsed);

export default config;
