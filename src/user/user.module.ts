import { UserController } from './user.controller';
import { UserService } from './user.service';

const service = new UserService();
export const userController = new UserController(service);
