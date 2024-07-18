import config from '../../config';
import { Environment } from '../../config/config.dto';
import { UserModel } from '../models/user.model';

export const adminSeed = async () => {
  if (config.ENV === Environment.dev) {
    const admin = {
      nick: 'admin',
      password: '$2b$10$y1TSrZDesZetxcbH97fpFO2pxVB4XLk5jRePuGVs2kCQA26XqBsTK',
    };

    const exists = await UserModel.findOne({ where: admin });
    if (!exists) {
      await UserModel.create(admin);
    }
  }
};
