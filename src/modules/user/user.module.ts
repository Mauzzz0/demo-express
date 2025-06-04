import { Container } from 'inversify';
import { UserAmqpController } from './user.amqp-controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const UserModule = new Container();

UserModule.bind(UserService).toSelf().inSingletonScope();
UserModule.bind(UserController).toSelf().inSingletonScope();
UserModule.bind(UserAmqpController).toSelf().inSingletonScope();

export default UserModule;
