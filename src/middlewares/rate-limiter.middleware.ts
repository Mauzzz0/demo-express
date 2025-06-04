import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';
import { TooManyRequestsException } from '../exceptions';

const limit = 100;
const range = 'minute';

const storage = {
  count: 0,
  lastTime: dayjs().startOf(range),
};

export const RateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const currentPeriod = dayjs().startOf(range);
  const lastRequestWasInCurrentPeriod = currentPeriod.isSame(storage.lastTime);

  storage.count++;

  res.setHeader('x-request-limit', limit);
  res.setHeader('x-request-used', storage.count);
  res.setHeader('x-request-remain', limit - storage.count);
  res.setHeader('x-request-next-period', currentPeriod.add(1, range).toISOString());

  if (lastRequestWasInCurrentPeriod && storage.count >= limit) {
    throw new TooManyRequestsException();
  }

  if (!lastRequestWasInCurrentPeriod) {
    storage.count = 0;
  }

  storage.lastTime = dayjs().startOf(range);

  next();
};
