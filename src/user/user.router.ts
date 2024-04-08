import express from 'express';
import { UserController } from './user.controller';

export const userRouter = express.Router();

userRouter.get('/profile', UserController.profile);
userRouter.post('/login', UserController.login);
userRouter.post('/logout', UserController.logout);
