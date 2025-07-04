import { UserEntity } from '../../database';

export enum UserRole {
  user = 'user',
  admin = 'admin',
}

export type NewRegistrationMessage = {
  id: UserEntity['id'];
  email: UserEntity['email'];
  name: UserEntity['name'];
};

export type LoginEvent = {
  time: string;
  ip: string;
  email: string;
  success: boolean;
  failReason?: string;
};
