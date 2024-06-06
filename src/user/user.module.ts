import { UserService } from './user.service';
import { UserController } from './user.controller';

const service = new UserService();
export const userController = new UserController(service);
