import pino from 'pino';
import pretty from 'pino-pretty';

const stream = pretty({
  colorize: true,
  sync: true,
});

const logger = pino(stream);

export default logger;
