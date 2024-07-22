import { UserRole } from './database/models';

declare global {
  namespace Express {
    interface Locals {
      user: {
        id: number;
        role: UserRole;
      };
    }
  }
}
