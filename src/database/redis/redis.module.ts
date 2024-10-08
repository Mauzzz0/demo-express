import { Container } from 'inversify';
import { Components } from '../../shared/inversify.types';
import { RedisService } from './redis.service';

export const createRedisModule = () => {
  const container = new Container();

  container.bind<RedisService>(Components.Redis).to(RedisService).inSingletonScope();

  return container;
};
