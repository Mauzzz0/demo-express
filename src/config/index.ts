import dotenv from 'dotenv';
import { ConfigSchema } from './schema';

const path = process.env.NODE_ENV === 'prod' ? '.env.production' : '.env';

const result = dotenv.config({ path });

if (result.error) {
  throw result.error;
}

const validation = ConfigSchema.validate(result.parsed);

if (validation.error) {
  throw validation.error;
}

const config = validation.value;

export default config;
