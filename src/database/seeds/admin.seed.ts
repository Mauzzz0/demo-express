import { hashSync } from 'bcrypt';

import config from '../../config';
import { Environment } from '../../config/config.dto';
import { UserModel } from '../models';

export const adminSeed = async () => {
  if (config.ENV === Environment.dev) {
    const admin = {
      nick: config.ADMIN_NICK,
      password: hashSync(config.ADMIN_PASSWORD, config.SALT),
    };

    const exists = await UserModel.findOne({ where: { nick: admin.nick } });
    if (!exists) {
      await UserModel.create(admin);
      console.log('Successfully seeded default admin');
    }
  }
};
