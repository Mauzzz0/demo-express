import { Request, Response } from 'express';

const mock = 'mock';

export const getAll = (req: Request, res: Response) => {
  res.send(mock);
};

export const getOne = (req: Request, res: Response) => {
  res.send(mock);
};

export const createOne = (req: Request, res: Response) => {
  res.send(mock);
};
