import { User } from '../../entities/User';

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const mapUserToResponse = (user: User): UserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

