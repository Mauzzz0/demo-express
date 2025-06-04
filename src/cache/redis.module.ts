import { Container } from 'inversify';
import { RedisService } from './redis.service';

const RedisModule = new Container();

RedisModule.bind<RedisService>(RedisService).toSelf().inSingletonScope();

export default RedisModule;
