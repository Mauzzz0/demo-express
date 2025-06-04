import { UserRole } from './database/entities';

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
