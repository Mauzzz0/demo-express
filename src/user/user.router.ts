import express from 'express';
import { UserController } from './user.controller';
import JwtGuard from '../jwt/jwt.guard';

export const userRouter = express.Router();

userRouter.post('/login', UserController.login);
userRouter.post('/signup', UserController.signup);
userRouter.get('/profile', JwtGuard, UserController.profile);
userRouter.post('/logout', JwtGuard, UserController.logout);
userRouter.post('/refresh', JwtGuard, UserController.refresh);
