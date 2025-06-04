export const redisTelegramKey = (key: string) => `telegram:${key}`;
export const redisRefreshTokenKey = (refreshToken: string) => `refresh:${refreshToken}`;
export const redisRestorePasswordKey = (userId: number) => `restore:user-${userId}`;
export const redisTempMailKey = (mail: string) => `temp-mail:${mail}`;
