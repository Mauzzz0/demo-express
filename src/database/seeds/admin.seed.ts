import { hashSync } from 'bcrypt';
import { CreationAttributes } from 'sequelize';
import { appConfig } from '../../config';
import { Environment } from '../../config/dto';
import logger from '../../logger';
import { UserRole } from '../../modules/user/user.types';
import { UserEntity } from '../entities';

export const adminSeed = async () => {
  if (appConfig.env === Environment.dev) {
    const admin: CreationAttributes<UserEntity> = {
      name: 'Администратор',
      email: appConfig.admin.email,
      role: UserRole.admin,
      password: hashSync(appConfig.admin.password, 10),
    };

    const exists = await UserEntity.findOne({ where: { email: admin.email } });
    if (!exists) {
      await UserEntity.create(admin);
      logger.info('Successfully seeded default admin');
    }
  }
};
