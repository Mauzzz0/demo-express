import { Request, Response } from 'express';

export const storage: any[] = [];

export const memoryLeak = (req: Request, res: Response) => {
  for (let i = 0; i < 10; i++) {
    const arr = Array.from({ length: 2 * 1024 * 1024 }).fill('*');

    storage.push(arr);
  }

  res.json({ status: 'ok' });
};
