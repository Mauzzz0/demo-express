import { hashSync } from 'bcrypt';

import { Environment } from '../../config/config.dto';
import { ConfigService } from '../../config/config.service';
import { UserModel, UserRole } from '../models';

export const adminSeed = async (config: ConfigService) => {
  if (config.env.ENV === Environment.dev) {
    const admin = {
      nick: config.env.ADMIN_NICK,
      email: config.env.ADMIN_EMAIL,
      role: UserRole.admin,
      password: hashSync(config.env.ADMIN_PASSWORD, config.env.SALT),
    };

    const exists = await UserModel.findOne({ where: { nick: admin.nick } });
    if (!exists) {
      await UserModel.create(admin);
      console.log('Successfully seeded default admin');
    }
  }
};
