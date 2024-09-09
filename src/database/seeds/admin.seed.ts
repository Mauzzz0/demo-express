import { hashSync } from 'bcrypt';

import { Environment } from '../../config/config.dto';
import { ConfigService } from '../../config/config.service';
import { UserModel, UserRole } from '../models';

export const adminSeed = async (config: ConfigService) => {
  if (config.env.env === Environment.dev) {
    const admin = {
      nick: config.env.admin.nick,
      email: config.env.admin.email,
      role: UserRole.admin,
      password: hashSync(config.env.admin.password, config.env.jwt.salt),
    };

    const exists = await UserModel.findOne({ where: { nick: admin.nick } });
    if (!exists) {
      await UserModel.create(admin);
      console.log('Successfully seeded default admin');
    }
  }
};
