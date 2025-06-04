import { hashSync } from 'bcrypt';
import { appConfig } from '../../config';
import { Environment } from '../../config/app-config.dto';
import logger from '../../logger/pino.logger';
import { UserEntity, UserRole } from '../entities';

export const adminSeed = async () => {
  if (appConfig.env === Environment.dev) {
    const admin = {
      nick: appConfig.admin.nick,
      email: appConfig.admin.email,
      role: UserRole.admin,
      password: hashSync(appConfig.admin.password, 10),
    };

    const exists = await UserEntity.findOne({ where: { nick: admin.nick } });
    if (!exists) {
      await UserEntity.create(admin);
      logger.info('Successfully seeded default admin');
    }
  }
};
