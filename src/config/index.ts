import dotenv from 'dotenv';
import { ConfigSchema } from './schema';

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const validation = ConfigSchema.validate(result.parsed);

if (validation.error) {
  throw validation.error;
}

const config = validation.value;

export default config;
